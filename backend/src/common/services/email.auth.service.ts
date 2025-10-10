import { injectable, inject } from "inversify";
import { TYPES } from "../types";
import { IEmailService, IOtpService, IpasswordService, ITokenService } from "../utils";
import { IUserRepo } from "../Repo";
import { RedisKeys } from "../constants";

export type SignUpRes = {
  message: string;
};
export interface IEmailAuthService {
  reqSignup(data: {
    name: string;
    email: string;
    password: string;
    role: string;
  }): Promise<SignUpRes | null>;
  signup(email: string, otp: string): Promise<{ user: IUserDto; tokens: Tokens }>;
  login(email: string, password: string): Promise<{ user: IUserDto; tokens: Tokens }>;
}

@injectable()
export class EmailAuthService implements IEmailAuthService {
  constructor(
    @inject(TYPES.IUserRepo) private _userRepo: IUserRepo,
    @inject(TYPES.PasswordService) private _passwordService: IpasswordService,
    @inject(TYPES.OtpService) private _otpService: IOtpService,
    @inject(TYPES.EmailService) private _emailService: IEmailService,
    @inject(TYPES.TokenService) private _tokenService: ITokenService,
  ) {}
  async reqSignup(data: {
    name: string;
    email: string;
    password: string;
    role: string;
  }): Promise<SignUpRes | null> {
    const match = await this._userRepo.findByEmail(data.email);

    if (match) {
      throw new Error("already exist");
    }
    const otp = await this._otpService.generateOtp();
    const passwordHash = await this._passwordService.hashPassword(data.password);
    //redis
    data.password = passwordHash;
    await this._otpService.storeOtp(`${RedisKeys.SIGNUP}:${data.email}`, { ...data, otp }, 60);
    //email
    await this._emailService.sendSignupOtp(data.email, otp);

    return { message: "otp sent for verification" };
  }
  async signup(email: string, otp: string): Promise<{ user: IUserDto; tokens: Tokens }> {}
  async login(email: string, password: string): Promise<{ user: IUserDto; tokens: Tokens }> {}
}
