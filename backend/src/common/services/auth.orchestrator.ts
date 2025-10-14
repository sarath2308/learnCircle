import { inject, injectable, multiInject } from "inversify";
import { IPasswordResetService } from "./password.reset.service";
import { OtpRes, Role, TYPES } from "../types";
import { IEmailAuthService } from "./email.auth.service";
import { IAuthProviderService } from "../interface";
import { UserResponseDto } from "../dtos";
import { ITokens } from "../utils";

export interface IAuthOrchestrator {
  reqSignup: (name: string, email: string, password: string, role: Role) => Promise<OtpRes | null>;
  signup: (
    email: string,
    token: string,
    otp: string,
  ) => Promise<{ user: UserResponseDto; tokens: ITokens } | null>;
  resendSignupOtp: (token: string) => Promise<OtpRes | null>;
  login: (
    email: string,
    password: string,
    role: string,
  ) => Promise<{ user: UserResponseDto; tokens: ITokens } | null>;
  forgotPassword: (email: string, role: string) => Promise<OtpRes | null>;
  verifyForgotOtp: (email: string, otp: string, role: string) => Promise<OtpRes | null>;
  resendForgotOtp: (email: string, role: string) => Promise<OtpRes | null>;
  resetPassword: (
    token: string,
    email: string,
    newPassword: string,
    role: string,
  ) => Promise<OtpRes | null>;
  providersSignin: (
    providerName: string,
    token: string,
    role: string,
  ) => Promise<{ user: UserResponseDto; tokens: ITokens } | null>;
}
@injectable()
export class AuthOrchestrator implements IAuthOrchestrator {
  private providerMap: Map<string, IAuthProviderService> = new Map();
  constructor(
    @inject(TYPES.IEmailAuthService) private _emailAuthService: IEmailAuthService,
    @inject(TYPES.IPasswordResetService) private _passwordResetService: IPasswordResetService,
    @multiInject(TYPES.IProviderAuth) private _providers: IAuthProviderService[],
  ) {
    for (const provider of _providers) {
      this.providerMap.set(provider.providerName, provider);
    }
  }
  async reqSignup(
    name: string,
    email: string,
    password: string,
    role: Role,
  ): Promise<OtpRes | null> {
    let result = await this._emailAuthService.reqSignup({ name, email, password, role });
    return result;
  }
  async signup(
    email: string,
    token: string,
    otp: string,
  ): Promise<{ user: UserResponseDto; tokens: ITokens } | null> {
    return await this._emailAuthService.signup(email, token, otp);
  }
  async resendSignupOtp(token: string): Promise<OtpRes | null> {
    return await this._emailAuthService.resendSignup(token);
  }

  async login(
    email: string,
    password: string,
    role: string,
  ): Promise<{ user: UserResponseDto; tokens: ITokens } | null> {
    let result = await this._emailAuthService.login(email, password, role);
    return result;
  }
  async forgotPassword(email: string, role: string): Promise<OtpRes | null> {
    let result = await this._passwordResetService.reqResetOtp(email, role);
    return result;
  }
  async verifyForgotOtp(email: string, otp: string): Promise<OtpRes | null> {
    let res = await this._passwordResetService.verify(email, otp);
    return res;
  }
  async resendForgotOtp(email: string, role: string): Promise<OtpRes | null> {
    let res = await this._passwordResetService.resendOtp(email, role);
    return res;
  }
  async resetPassword(token: string, email: string, newPassword: string): Promise<OtpRes | null> {
    let res = await this._passwordResetService.reset(token, email, newPassword);
    return res;
  }

  async providersSignin(
    providerName: string,
    token: string,
    role: string,
  ): Promise<{ user: UserResponseDto; tokens: ITokens } | null> {
    const provider = this.providerMap.get(providerName);
    if (!provider) throw new Error(`Unsupported provider: ${providerName}`);
    return await provider.signIn(token, role);
  }
}
