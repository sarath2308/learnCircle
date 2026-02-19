import { injectable, inject } from "inversify";
import { TYPES } from "@/types/shared/inversify/types";
import { IProfessionalProfileRepo } from "@/interface/professional/professional.profile.repo.interface";
import { Types } from "mongoose";
import { IUserRepo } from "@/repos/shared/user.repo";
import { IProfessionalProfileService } from "@/interface/professional/professional.profile.service.interface";
import { ProfessionalProfileDTOType } from "@/schema/professional/profile.request.schema";
import { AppError } from "@/errors/app.error";
import { Messages } from "@/constants/shared/messages";
import { HttpStatus } from "@/constants/shared/httpStatus";
import { IS3Service } from "@/interface/shared/s3.service.interface";
import {
  LearnerProfessionalProfileCardResponseSchema,
  LearnerProfessionalProfileResponseType,
} from "@/schema/learner/professional-profile/learner.professional.profile.response.schema";
import { LearnerProfessionalProfileResponseSchema } from "@/schema/learner/professional-profile/learner.professional.profile.response";
import { UploadedFile } from "@/interface/shared/uploadFile.interface";
import { IEmailService, IOtpService, IpasswordService } from "@/utils";
import { IRedisRepository } from "@/repos/shared/redisRepo";
import { RedisKeys } from "@/constants/shared/redisKeys";
import { ProfessionalProfileUpdateType } from "@/schema/professional/professional-profile/professiona.profile.update.schema";

@injectable()
export class ProfessionalProfileService implements IProfessionalProfileService {
  constructor(
    @inject(TYPES.IProfessionalProfileRepo) private _profileRepo: IProfessionalProfileRepo,
    @inject(TYPES.IS3Service) private _s3Service: IS3Service,
    @inject(TYPES.IUserRepo) private _userRepo: IUserRepo,
    @inject(TYPES.IPasswordService) private _passwordService: IpasswordService,
    @inject(TYPES.IRedisRepository) private _redisRepo: IRedisRepository,
    @inject(TYPES.IOtpService) private _otpService: IOtpService,
    @inject(TYPES.IEmailService) private _emailService: IEmailService,
  ) {}
  /**
   *
   * @param userId
   * @param data
   * @param files
   */
  async uploadData(
    userId: string,
    data: ProfessionalProfileDTOType,
    files: { avatar: UploadedFile; resume: UploadedFile },
  ): Promise<void> {
    const user = await this._userRepo.findById(userId);

    if (!user) {
      throw new AppError(Messages.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    let profileData = await this._profileRepo.getProfile(userId);

    if (!profileData) {
      profileData = await this._profileRepo.create({
        userId: new Types.ObjectId(userId),
        title: data.title,
        bio: data.bio,
        companyName: data.companyName,
        experience: data.experience,
        skills: data.skills,
        typesOfSessions: data.typesOfSessions,
        status: "processing",
      });
    } else {
      // Update existing profile fields
      profileData.title = data.title;
      profileData.bio = data.bio;
      profileData.companyName = data.companyName;
      profileData.experience = data.experience;
      profileData.skills = data.skills;
      profileData.typesOfSessions = data.typesOfSessions;
      profileData.status = "processing";

      await profileData.save(); // Save updated fields
    }

    const profile_key = await this._s3Service.generateS3Key(userId, files.avatar.originalName);
    await this._s3Service.uploadFileFromStream(
      files.avatar.path,
      profile_key,
      files.avatar.mimeType,
      3600,
    );
    profileData.profile_key = profile_key;
    await profileData.save();

    const resume_key = await this._s3Service.generateS3Key(userId, files.resume.originalName);
    await this._s3Service.uploadFileFromStream(
      files.resume.path,
      resume_key,
      files.resume.mimeType,
      3600,
    );
    profileData.resume_key = resume_key;
    await profileData.save();
  }

  async getAllProfilesForUser(
    search: string,
    page: number,
  ): Promise<LearnerProfessionalProfileResponseType[]> {
    const profileData = await this._profileRepo.getAllProfileForUser(page, search);

    const responseObj = Promise.all(
      profileData.map(async (profile) => {
        let profileUrl = null;
        if (profile.profile_key) {
          profileUrl = await this._s3Service.getFileUrl(profile.profile_key);
        }
        return LearnerProfessionalProfileCardResponseSchema.parse({
          name: profile.name,
          rating: profile.rating,
          instructorId: String(profile.userId),
          profileUrl: profileUrl ?? "",
          title: profile.title ?? "",
        });
      }),
    );
    return responseObj;
  }

  async getProfessionalProfileForUser(
    instructorId: string,
  ): Promise<LearnerProfessionalProfileResponseType> {
    const profileData = await this._profileRepo.getProfileOfInstructor(instructorId);
    if (!profileData) {
      throw new AppError(Messages.PROFILE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    console.log("Profile Data:", profileData); // Debug log to check the retrieved profile data
    let profileUrl = null;
    if (profileData.profile_key) {
      profileUrl = await this._s3Service.getFileUrl(profileData.profile_key);
    }

    const reponseObj = {
      userId: String(profileData.userId),
      email: profileData.email,
      name: profileData.name ?? "",
      bio: profileData.bio,
      companyName: profileData.companyName,
      experience: profileData.experience,
      profileUrl: profileUrl ?? "",
      rating: profileData.rating ?? 0,
      sessionPrice: profileData.sessionPrice ?? 0,
      skills: profileData.skills,
      title: profileData.title,
      totalSessions: profileData.totalSessions ?? 0,
      typesOfSessions: profileData.typesOfSessions,
      instructorId: String(profileData.userId),
    };

    return LearnerProfessionalProfileResponseSchema.parse(reponseObj);
  }

  async updateRating(instructorId: string, rating: number): Promise<void> {
    await this._profileRepo.updateRating(instructorId, rating);
  }

  async updateSessions(instructorId: string): Promise<void> {
    await this._profileRepo.increaseSessionCount(instructorId);
  }

  async updatePassword(
    instructorId: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    const instructorData = await this._userRepo.findById(instructorId);
    if (!instructorData) {
      throw new AppError(Messages.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    if (instructorData.passwordHash) {
      const check = await this._passwordService.comparePassword(
        instructorData.passwordHash,
        oldPassword,
      );
      if (!check) {
        throw new AppError(Messages.INCORRECT_PASSWORD, HttpStatus.NOT_MODIFIED);
      }
    }

    const hashed = await this._passwordService.hashPassword(newPassword);
    instructorData.passwordHash = hashed;
    await instructorData.save();
  }
  async updateProfilePicture(instructorId: string, file: UploadedFile): Promise<void> {
    const instructorData = await this._userRepo.findById(instructorId);
    if (!instructorData) {
      throw new AppError(Messages.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    const profileData = await this._profileRepo.getProfile(instructorId);
    if (!profileData) {
      throw new AppError(Messages.PROFILE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    const key = await this._s3Service.generateS3Key(instructorId, file.originalName);
    await this._s3Service.uploadFileFromStream(file.path, key, file.mimeType, 900);

    profileData.profile_key = key;
    await profileData.save();
  }

  async logout(userId: string, jti: string): Promise<void> {
    let user = await this._userRepo.findById(userId);

    if (!user) {
      throw new AppError(Messages.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    await this._redisRepo.set(
      `${RedisKeys.BLACKLIST}:${jti}`,
      "true",
      Number(process.env.JTI_EXPIRES_IN) || 900,
    );
  }

  async updateProfile(instructorId: string, data: ProfessionalProfileUpdateType): Promise<void> {
    const instructorData = await this._userRepo.findById(instructorId);
    if (!instructorData) {
      throw new AppError(Messages.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    const instructorProfileData = await this._profileRepo.getProfileByInstructorId(instructorId);
    if (!instructorProfileData) {
      throw new AppError(Messages.PROFILE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    instructorData.name = data.name ?? instructorData.name;
    instructorProfileData.title = data.title ?? instructorProfileData.title;
    instructorProfileData.companyName = data.companyName ?? instructorProfileData.companyName;
    instructorProfileData.experience = data.experience ?? instructorProfileData.experience;
    instructorProfileData.bio = data.bio ?? instructorProfileData.bio;

    await instructorData.save();
    await instructorProfileData.save();
  }

  async requestChangeEmail(instructorId: string, newEmail: string): Promise<void> {
    let user = await this._userRepo.findById(instructorId);

    if (!user) {
      throw new AppError(Messages.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    let otp = await this._otpService.generateOtp();
    await this._otpService.storeOtp(
      `${RedisKeys.EMAIL}:${instructorId}`,
      { newEmail: newEmail, ...user, otp },
      360,
    );
    await this._emailService.sendChangeEmailOtp(newEmail, otp);
  }

  async verifyAndUpdateEmail(instructorId: string, otp: string): Promise<void> {
    let user = await this._userRepo.findById(instructorId);

    if (!user) {
      throw new AppError(Messages.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    let data = await this._otpService.verifyOtp(`${RedisKeys.EMAIL}:${instructorId}`, otp);
    let updatedData = await this._userRepo.update(instructorId, { email: data.newEmail });

    if (!updatedData) {
      throw new AppError(Messages.PROFILE_NOT_UPDATED, HttpStatus.NOT_MODIFIED);
    }
  }
}
