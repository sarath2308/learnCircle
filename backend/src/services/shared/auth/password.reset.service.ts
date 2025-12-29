import { inject, injectable } from "inversify";
import { TYPES } from "@/types/shared/inversify/types";
import { IEmailService, IOtpService, IpasswordService, ITokenService } from "../../../utils";
import { IRedisRepository } from "@/repos/shared/redisRepo";
import { OtpRes } from "@/types";
import { IPasswordResetService } from "@/interface/shared/password.reset.interface";
import { AppError } from "@/errors/app.error";
import { IUserRepo } from "@/repos/shared/user.repo";
import { Messages } from "@/constants/shared/messages";
import { HttpStatus } from "@/constants/shared/httpStatus";
import { RedisKeys } from "@/constants/shared/redisKeys";
@injectable()
export class PasswordResetService implements IPasswordResetService {
  constructor(
    @inject(TYPES.IEmailService) private _emailService: IEmailService,

    @inject(TYPES.IOtpService) private _otpService: IOtpService,

    @inject(TYPES.IUserRepo) private _userRepo: IUserRepo,

    @inject(TYPES.ITokenService) private _tokenService: ITokenService,

    @inject(TYPES.IPasswordService) private _passwordService: IpasswordService,

    @inject(TYPES.IRedisRepository) private _redisRepo: IRedisRepository,
  ) {}
  /**
   *
   * @param email
   * @param role
   * @returns
   */
  async reqResetOtp(email: string, role: string): Promise<OtpRes> {
    const match = await this._userRepo.findWithEmailAndRole(email, role);

    if (!match) {
      throw new AppError(Messages.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const otp = this._otpService.generateOtp();

    await this._otpService.storeOtp(
      `${RedisKeys.FORGOT}:${email}`,
      { name: match.name, email: match.email, role: match.role, otp: otp },
      60,
    );
    //email
    await this._emailService.sendForgotPasswordOtp(email, otp);

    return { message: "otp sent for verification" };
  }
  /**
   *
   * @param email
   * @returns
   */
  async resendOtp(email: string) {
    let match = await this._userRepo.findByEmail(email);

    if (!match) {
      throw new AppError(Messages.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const otp = this._otpService.generateOtp();

    await this._otpService.storeOtp(
      `${RedisKeys.FORGOT}:${email}`,
      { name: match.name, email: match.email, role: match.role, otp: otp },
      60,
    );
    //email
    await this._emailService.sendForgotPasswordOtp(email, otp);

    return { message: "otp sent for verification" };
  }
  /**
   *
   * @param email
   * @param otp
   * @returns
   */
  async verify(email: string, otp: string): Promise<OtpRes> {
    console.log(`email:${email},otp:${otp}`);
    await this._otpService.verifyOtp(`${RedisKeys.FORGOT}:${email}`, otp);

    const user = await this._userRepo.findByEmail(email);
    if (!user) {
      throw new AppError(Messages.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    const tempToken = await this._tokenService.signTempToken({ userId: user.id, type: "reset" });

    await this._otpService.storeOtp(
      `${RedisKeys.RESET_TOKEN}:${tempToken}`,
      { userId: user.id },
      300,
    );

    return {
      message: "OTP verified",
      tempToken,
    };
  }
  /**
   *
   * @param token
   * @param email
   * @param newPassword
   * @returns
   */
  async reset(token: string, email: string, newPassword: string): Promise<OtpRes> {
    console.log(`--------token---${token}`);
    let verify = await this._redisRepo.get(`${RedisKeys.RESET_TOKEN}:${token}`);
    if (!verify) {
      throw new AppError("time limit expired", HttpStatus.BAD_REQUEST);
    }
    let match = await this._userRepo.findByEmail(email);

    if (!match) {
      throw new AppError(Messages.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    let passwordHash = await this._passwordService.hashPassword(newPassword);

    await this._userRepo.updatePassword(match.id, passwordHash);

    return { message: "password updated" };
  }
}
