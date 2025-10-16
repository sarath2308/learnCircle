import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { IEmailService, IOtpService, IpasswordService, ITokenService } from "../utils";
import { IUserRepo } from "../Repo";
import { HttpStatus, Messages, RedisKeys } from "../constants";
import { OtpRes } from "../types";
import { IPasswordResetService } from "../interface/IPasswordResetService";
import { AppError } from "../errors/app.error";
@injectable()
export class PasswordResetService implements IPasswordResetService {
  constructor(
    @inject(TYPES.IEmailService) private _emailService: IEmailService,

    @inject(TYPES.IOtpService) private _otpService: IOtpService,

    @inject(TYPES.IUserRepo) private _userRepo: IUserRepo,

    @inject(TYPES.ITokenService) private _tokenService: ITokenService,

    @inject(TYPES.IPasswordService) private _passwordService: IpasswordService,
  ) {}
  /**
   *
   * @param email
   * @param role
   * @returns
   */
  async reqResetOtp(email: string, role: string): Promise<OtpRes | null> {
    const match = await this._userRepo.findWithEmailAndRole(email, role);

    if (!match) {
      throw new AppError(Messages.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const otp = this._otpService.generateOtp();

    await this._otpService.storeOtp(
      `${RedisKeys.FORGOT}:${email}`,
      { name: match.name, email: match.email, role: match.role },
      60,
    );

    let tempToken = await this._tokenService.signTempToken({
      userId: match.id,
      role: match.role,
    });
    //email
    await this._emailService.sendForgotPasswordOtp(email, otp);

    return { message: "otp sent for verification", tempToken };
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
      { name: match.name, email: match.email, role: match.role },
      60,
    );

    let tempToken = await this._tokenService.signTempToken({
      userId: match.id,
      role: match.role,
    });
    //email
    await this._emailService.sendForgotPasswordOtp(email, otp);

    return { message: "otp sent for verification", tempToken };
  }
  /**
   *
   * @param email
   * @param otp
   * @returns
   */
  async verify(email: string, otp: string): Promise<OtpRes | null> {
    const stored = await this._otpService.verifyOtp(`${RedisKeys.FORGOT}:${email}`, otp);

    if (!stored) {
      throw new AppError(Messages.OTP_EXPIRED, HttpStatus.NOT_FOUND);
    }

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
  async reset(token: string, email: string, newPassword: string): Promise<OtpRes | null> {
    let verify = await this._tokenService.verifyTempToken(token);

    if (!verify?.success) {
      throw new Error("time limit expired");
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
