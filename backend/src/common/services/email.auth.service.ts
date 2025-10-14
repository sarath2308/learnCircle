import { injectable, inject } from "inversify";
import { TYPES } from "../types";
import { IEmailService, IOtpService, IpasswordService, ITokenService } from "../utils";
import { RedisKeys } from "../constants";
import { ITokens } from "../utils";
import { IUserDtoMapper } from "../dtos/mapper/user.map";
import { UserResponseDto } from "../dtos";
import { IUserRepo, OtpRes } from "@/common";
import { IPendingSignupRepo } from "../Repo/pendingSignup.repo";
export interface IEmailAuthService {
  reqSignup(data: {
    name: string;
    email: string;
    password: string;
    role: "learner" | "professional" | "admin";
  }): Promise<OtpRes | null>;
  resendSignup(token: string): Promise<OtpRes | null>;
  signup(
    email: string,
    token: string,
    otp: string,
  ): Promise<{ user: UserResponseDto; tokens: ITokens } | null>;
  login(
    email: string,
    password: string,
    role: string,
  ): Promise<{ user: UserResponseDto; tokens: ITokens } | null>;
}

@injectable()
export class EmailAuthService implements IEmailAuthService {
  constructor(
    @inject(TYPES.IPendingSignup) private _pendingUserRepo: IPendingSignupRepo,
    @inject(TYPES.IUserRepo) private _userRepo: IUserRepo,
    @inject(TYPES.IPasswordService) private _passwordService: IpasswordService,
    @inject(TYPES.IOtpService) private _otpService: IOtpService,
    @inject(TYPES.IEmailService) private _emailService: IEmailService,
    @inject(TYPES.ITokenService) private _tokenService: ITokenService,
    @inject(TYPES.IUserDtoMapper) private _userDtoMapper: IUserDtoMapper,
  ) {}
  async reqSignup(data: {
    name: string;
    email: string;
    password: string;
    role: "learner" | "professional" | "admin";
  }): Promise<OtpRes | null> {
    const match = await this._userRepo.findByEmail(data.email);

    if (match) {
      throw new Error("already exist");
    }
    const otp = await this._otpService.generateOtp();
    const passwordHash = await this._passwordService.hashPassword(data.password);
    data.password = passwordHash;
    await this._otpService.storeOtp(`${RedisKeys.SIGNUP}:${data.email}`, { ...data, otp }, 60);
    let pendingUser = await this._pendingUserRepo.create({ ...data });
    let tempToken = await this._tokenService.signTempToken({
      userId: pendingUser.id,
      role: pendingUser.role,
    });
    //email
    await this._emailService.sendSignupOtp(data.email, otp);

    return { message: "otp sent for verification", tempToken };
  }
  async resendSignup(token: string) {
    const verify = await this._tokenService.verifyTempToken(token);

    if (!verify?.data?.userId) {
      throw new Error("Invalid or malformed token");
    }

    const data = await this._pendingUserRepo.findById(verify.data.userId);
    if (!data) {
      throw new Error("User not found or signup expired");
    }

    const otp = await this._otpService.generateOtp();

    await this._otpService.storeOtp(`${RedisKeys.SIGNUP}:${data.email}`, { ...data, otp }, 60);

    const tempToken = await this._tokenService.signTempToken({
      userId: data.id,
      role: data.role,
    });

    await this._emailService.sendSignupOtp(data.email, otp);

    return { message: "OTP resent successfully", tempToken };
  }

  async signup(
    email: string,
    token: string,
    otp: string,
  ): Promise<{ user: UserResponseDto; tokens: ITokens }> {
    try {
      let verify = await this._tokenService.verifyTempToken(token);
      if (!verify?.success) {
        throw new Error("invalid otp");
      }
      if (!verify.data.userId) {
        throw new Error("userid missing");
      }
      let data = await this._pendingUserRepo.findById(verify.data.userId);
      if (!data) {
        throw new Error("user not found");
      }
      await this._otpService.verifyOtp(`${RedisKeys.SIGNUP}:${email}`, otp);
      const user = await this._userRepo.create({
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
        role: data.role,
      });
      await this._pendingUserRepo.delete(data.id);
      // Generate tokens
      const tokens = await this._tokenService.generateTokens({ userId: user.id, role: user.role });
      let userDto = await this._userDtoMapper.toResponse(user);
      return { user: userDto, tokens };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Signup failed: ${error.message}`);
      }
      throw new Error(`Signup failed: ${String(error)}`);
    }
  }

  async login(
    email: string,
    password: string,
    role: string,
  ): Promise<{ user: UserResponseDto; tokens: ITokens } | null> {
    let User = await this._userRepo.findWithEmailAndRole(email, role);
    if (!User) {
      throw new Error("user not found");
    }
    if (User.isBlocked) {
      throw new Error("blocked user");
    }
    if (!User.passwordHash) {
      throw new Error("user has used google Account");
    }
    let passwordCheck = await this._passwordService.comparePassword(User.passwordHash, password);
    if (!passwordCheck) {
      throw new Error("Incorrect password");
    }
    let tokens = await this._tokenService.generateTokens({ userId: User.id, role: User.role });
    let userDto = await this._userDtoMapper.toResponse(User);
    return { user: userDto, tokens };
  }
}
