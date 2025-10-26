import {
  AppError,
  HttpStatus,
  IEmailService,
  IOtpService,
  IS3Service,
  Messages,
  OtpData,
  RedisKeys,
} from "@/common";
import { TYPES } from "@/common/types/inversify/types";
import { inject, injectable } from "inversify";
import { IpasswordService } from "@/common";
import { LearnerProfileDTOType } from "../dtos/schemas/profile.response.dto";
import { ILearnerProfileService } from "../interface/ILearnerProfileService";
import { IRedisRepository, IUserRepo } from "@/common/Repo";
import { ILearnerProfileRepo } from "../interface/ILearnerProfileRepo";
import { ILearnerProfileMapperService } from "../interface/ILearnerProfileMapper";

@injectable()
export class LearnerProfileService implements ILearnerProfileService {
  constructor(
    @inject(TYPES.IUserRepo) private _userRepo: IUserRepo,
    @inject(TYPES.ILearnerProfileRepo) private _profileRepo: ILearnerProfileRepo,
    @inject(TYPES.IPasswordService) private _passwordService: IpasswordService,
    @inject(TYPES.IOtpService) private _otpService: IOtpService,
    @inject(TYPES.IS3Service) private _s3Service: IS3Service,
    @inject(TYPES.IRedisRepository) private _redisRepo: IRedisRepository,
    @inject(TYPES.IEmailService) private _emailService: IEmailService,
    @inject(TYPES.ILearnerProfileDto) private _profileMapper: ILearnerProfileMapperService,
  ) {}
  /**
   *
   * @param userId
   * @returns
   */
  async getProfile(userId: string): Promise<LearnerProfileDTOType | null> {
    const user = await this._userRepo.findById(userId);
    if (!user) {
      throw new AppError(Messages.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    let profile = await this._profileRepo.findByUserId(userId);

    if (!profile) {
      profile = await this._profileRepo.create({
        userId: user._id,
        currentSubject: [],
        joinedAt: new Date(),
        lastLogin: new Date(),
        streak: 1,
      });
    } else {
      const today = new Date();
      const lastLogin = profile.lastLogin ? new Date(profile.lastLogin) : null;

      if (lastLogin) {
        // Normalize both dates to midnight (ignore time)
        const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const lastLoginDateOnly = new Date(
          lastLogin.getFullYear(),
          lastLogin.getMonth(),
          lastLogin.getDate(),
        );

        const diffTime = todayDateOnly.getTime() - lastLoginDateOnly.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);

        if (diffDays === 1) {
          profile.streak = Number(profile.streak) + 1;
        } else if (diffDays > 1) {
          profile.streak = 1;
        }
      } else {
        profile.streak = 1;
      }

      profile.lastLogin = new Date();
      await profile.save();
    }
    if (profile.profile_key) {
      let profile_url = await this._s3Service.getFileUrl(profile.profile_key);
      return this._profileMapper.toDTO(user, profile, profile_url);
    }
    return this._profileMapper.toDTO(user, profile);
  }

  /**
   *
   * @param userId
   * @param fileBuffer
   */
  async updateProfilePhoto(
    userId: string,
    data: { originalName: string; mimeType: string; fileBuffer: Buffer },
  ) {
    const user = await this._userRepo.findById(userId);

    if (!user) throw new AppError(Messages.USER_NOT_FOUND, HttpStatus.NOT_FOUND);

    let profile = await this._profileRepo.findByUserId(userId);
    if (!profile) {
      profile = await this._profileRepo.create({
        userId: user._id,
        currentSubject: [],
        joinedAt: new Date(),
        lastLogin: new Date(),
        streak: 1,
      });
    }

    const key = await this._s3Service.generateS3Key(userId, data.originalName);
    const uploadUrl = await this._s3Service.uploadFileFromBuffer(
      data.fileBuffer,
      key,
      data.mimeType,
    );

    await this._profileRepo.storeProfileKey(userId, key);

    // Return DTO
    return uploadUrl;
  }
  /**
   *
   * @param userId
   * @param newEmail
   */

  async requestEmailChangeOtp(userId: string, newEmail: string): Promise<void> {
    let user = await this._userRepo.findById(userId);

    if (!user) {
      throw new AppError(Messages.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    let otp = await this._otpService.generateOtp();
    await this._otpService.storeOtp(
      `${RedisKeys.EMAIL}:${userId}`,
      { newEmail: newEmail, ...user, otp },
      360,
    );
    await this._emailService.sendChangeEmailOtp(newEmail, otp);
  }

  /**
   *
   * @param userId
   */

  async resendEmailChangeOtp(userId: string): Promise<void> {
    let user = await this._userRepo.findById(userId);

    if (!user) {
      throw new AppError(Messages.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    let data = await this._redisRepo.get<OtpData>(`${RedisKeys.EMAIL}:${userId}`);

    if (!data) {
      throw new AppError(Messages.OTP_SESSION_OUT, HttpStatus.BAD_REQUEST);
    }

    await this._redisRepo.delete(`${RedisKeys.EMAIL}:${userId}`);

    let otp = await this._otpService.generateOtp();
    data.otp = otp;

    await this._otpService.storeOtp(`${RedisKeys.EMAIL}:${userId}`, { ...data }, 360);

    await this._emailService.sendChangeEmailOtp(data?.newEmail!, otp);
  }

  /**
   *
   * @param userId
   * @param otp
   */

  async verifyEmailChangeOtp(userId: string, otp: string): Promise<LearnerProfileDTOType | null> {
    let user = await this._userRepo.findById(userId);

    if (!user) {
      throw new AppError(Messages.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    let data = await this._otpService.verifyOtp(`${RedisKeys.EMAIL}:${userId}`, otp);
    let updatedData = await this._userRepo.update(userId, { email: data.newEmail });
    let profileData = await this._profileRepo.findByUserId(userId);

    if (!profileData) {
      throw new AppError(Messages.PROFILE_NOT_FOUND, HttpStatus.NOT_MODIFIED);
    }

    if (!updatedData) {
      throw new AppError(Messages.PROFILE_NOT_UPDATED, HttpStatus.NOT_MODIFIED);
    }

    return this._profileMapper.toDTO(updatedData, profileData);
  }
  /**
   *
   * @param userId
   * @param name
   * @returns
   */

  async updateName(userId: string, name: string): Promise<LearnerProfileDTOType | null> {
    let user = await this._userRepo.findById(userId);

    let profileData = await this._profileRepo.findByUserId(userId);

    if (!user) {
      throw new AppError(Messages.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (!profileData) {
      throw new AppError(Messages.PROFILE_NOT_FOUND, HttpStatus.NOT_MODIFIED);
    }

    user.name = name;
    await user.save();
    return this._profileMapper.toDTO(user, profileData);
  }
  /**
   *
   * @param userId
   * @param newPassword
   * @param password
   * @returns
   */

  async updatePassword(
    userId: string,
    newPassword: string,
    password?: string,
  ): Promise<LearnerProfileDTOType | null> {
    let user = await this._userRepo.findById(userId);

    let profileData = await this._profileRepo.findByUserId(userId);

    if (!user) {
      throw new AppError(Messages.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    if (!profileData) {
      throw new AppError(Messages.PROFILE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (user.passwordHash && password) {
      let check = await this._passwordService.comparePassword(user.passwordHash, password);

      if (!check) {
        throw new AppError(Messages.INCORRECT_PASSWORD, HttpStatus.UNAUTHORIZED);
      } else {
        let hash = await this._passwordService.hashPassword(newPassword);
        user.passwordHash = hash;
        await user.save();
      }
    } else {
      let hash = await this._passwordService.hashPassword(newPassword);
      user.passwordHash = hash;
      await user.save();
    }

    return this._profileMapper.toDTO(user, profileData);
  }
  /**
   *
   * @param userId
   * @returns
   */

  async getProfileUrl(userId: string): Promise<{ profileUrl: string } | null> {
    let user = await this._userRepo.findById(userId);

    let profileData = await this._profileRepo.findByUserId(userId);

    if (!user) {
      throw new AppError(Messages.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (!profileData || !profileData.profile_key) {
      throw new AppError(Messages.PROFILE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    let profileUrl = await this._s3Service.getFileUrl(profileData.profile_key);

    return { profileUrl };
  }
}
