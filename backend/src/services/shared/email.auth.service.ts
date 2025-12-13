import { injectable, inject } from "inversify";
import { TYPES } from "@/types/shared/inversify/types";
import { IEmailAuthService } from "@/interface/shared/auth/IEmailAuthService";
import { IUserRepo } from "@/repos/shared/user.repo";
import {
  IEmailService,
  IOtpService,
  IpasswordService,
  ITokens,
  ITokenService,
  OtpData,
} from "@/utils";
import { IUserDtoMapper } from "@/mapper/shared/user.map";
import { IRedisRepository } from "@/repos/shared/redisRepo";
import { Messages } from "@/constants/shared/messages";
import { HttpStatus } from "@/constants/shared/httpStatus";
import { OtpRes } from "@/types";
import { RedisKeys } from "@/constants/shared/redisKeys";
import { AppError } from "@/errors/app.error";
import { UserResponseDto } from "@/schema/shared/auth/auth.dto.schema";

@injectable()
export class EmailAuthService implements IEmailAuthService {
  constructor(
    @inject(TYPES.IUserRepo) private _userRepo: IUserRepo,

    @inject(TYPES.IPasswordService) private _passwordService: IpasswordService,

    @inject(TYPES.IOtpService) private _otpService: IOtpService,

    @inject(TYPES.IEmailService) private _emailService: IEmailService,

    @inject(TYPES.ITokenService) private _tokenService: ITokenService,

    @inject(TYPES.IUserDtoMapper) private _userDtoMapper: IUserDtoMapper,

    @inject(TYPES.IRedisRepository) private _redisRepo: IRedisRepository,
  ) {}
  /**
   *
   * @param data
   * @returns
   */
  async reqSignup(data: {
    name: string;
    email: string;
    password: string;
    role: "learner" | "professional" | "admin";
  }): Promise<OtpRes> {
    const match = await this._userRepo.findByEmail(data.email);

    if (match) {
      throw new AppError(Messages.EMAIL_EXISTS, HttpStatus.CONFLICT);
    }
    const otp = await this._otpService.generateOtp();

    const passwordHash = await this._passwordService.hashPassword(data.password);

    data.password = passwordHash;

    await this._otpService.storeOtp(`${RedisKeys.SIGNUP}:${data.email}`, { ...data, otp }, 300);
    console.log("Saving key:", `${RedisKeys.SIGNUP}:${data.email}`);

    //email
    await this._emailService.sendSignupOtp(data.email, otp);

    return { message: "otp sent for verification" };
  }
  /**
   *
   * @param token
   * @returns
   */
  async resendSignupOtp(email: string) {
    let data = await this._redisRepo.get<OtpData>(`${RedisKeys.SIGNUP}:${email}`);

    if (!data) {
      throw new AppError(Messages.BAD_REQUEST, HttpStatus.BAD_REQUEST);
    }

    const otp = await this._otpService.generateOtp();

    await this._otpService.storeOtp(`${RedisKeys.SIGNUP}:${data.email}`, { ...data, otp }, 300);

    await this._emailService.sendSignupOtp(data.email, otp);

    return { message: "OTP resent successfully" };
  }
  /**
   *
   * @param email
   * @param token
   * @param otp
   * @returns
   */
  async signup(email: string, otp: string): Promise<{ user: UserResponseDto; tokens: ITokens }> {
    console.log("Verifying key:", `${RedisKeys.SIGNUP}:${email}`);
    let data = await this._otpService.verifyOtp(`${RedisKeys.SIGNUP}:${email}`, otp);
    console.log(`email${email},otp${otp}`);
    const user = await this._userRepo.create({
      name: data.name,
      email: data.email,
      passwordHash: data.password,
      role: data.role,
    });

    // Generate tokens
    const tokens = await this._tokenService.generateTokens({ userId: user.id, role: user.role });

    let userDto = await this._userDtoMapper.toResponse(user);

    return { user: userDto, tokens };
  }
  /**
   *
   * @param email
   * @param password
   * @param role
   * @returns
   */

  async login(
    email: string,
    password: string,
    role: string,
  ): Promise<{ user: UserResponseDto; tokens: ITokens }> {
    let User = await this._userRepo.findWithEmailAndRole(email, role);

    if (!User) {
      throw new AppError(Messages.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    if (User.isBlocked) {
      throw new AppError(Messages.BLOCKED_USER, HttpStatus.FORBIDDEN);
    }
    if (!User.passwordHash) {
      throw new AppError(Messages.USED_GOOGLE_AUTH, HttpStatus.BAD_REQUEST);
    }
    let passwordCheck = await this._passwordService.comparePassword(User.passwordHash, password);

    if (!passwordCheck) {
      throw new AppError(Messages.INVALID_CREDENTIALS, HttpStatus.NOT_FOUND);
    }
    let tokens = await this._tokenService.generateTokens({ userId: User.id, role: User.role });

    let userDto = await this._userDtoMapper.toResponse(User);

    return { user: userDto, tokens };
  }
}
