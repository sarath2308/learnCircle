import { inject, injectable, multiInject } from "inversify";
import { IPasswordResetService } from "@/interface/shared/IPasswordResetService";
import { OtpRes, Role } from "@/types";
import { TYPES } from "@/types/shared/inversify/types";
import { IEmailAuthService } from "@/interface/shared/IEmailAuthService";
import { IAuthProviderService } from "@/interface/shared/IAuthProviderService";
import { UserResponseDto } from "@/schema/shared/auth.dto.schema";
import { ITokens } from "@/utils";
import { IAuthOrchestrator } from "@/interface/shared/IAuthOrchestrator";
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
  /**
   *
   * @param name
   * @param email
   * @param password
   * @param role
   * @returns
   */
  async reqSignup(name: string, email: string, password: string, role: Role): Promise<OtpRes> {
    return await this._emailAuthService.reqSignup({ name, email, password, role });
  }
  /**
   *
   * @param email
   * @param token
   * @param otp
   * @returns
   */
  async signup(email: string, otp: string): Promise<{ user: UserResponseDto; tokens: ITokens }> {
    return await this._emailAuthService.signup(email, otp);
  }
  /**
   *
   * @param token
   * @returns
   */
  async resendSignupOtp(email: string): Promise<OtpRes> {
    return await this._emailAuthService.resendSignupOtp(email);
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
    return await this._emailAuthService.login(email, password, role);
  }
  /**
   *
   * @param email
   * @param role
   * @returns
   */
  async forgotPassword(email: string, role: string): Promise<OtpRes> {
    return await this._passwordResetService.reqResetOtp(email, role);
  }
  /**
   *
   * @param email
   * @param otp
   * @returns
   */
  async verifyForgotOtp(email: string, otp: string): Promise<OtpRes> {
    return await this._passwordResetService.verify(email, otp);
  }
  /**
   *
   * @param email
   * @param role
   * @returns
   */
  async resendForgotOtp(email: string, role: string): Promise<OtpRes> {
    return await this._passwordResetService.resendOtp(email, role);
  }
  /**
   *
   * @param token
   * @param email
   * @param newPassword
   * @returns
   */
  async resetPassword(token: string, email: string, newPassword: string): Promise<OtpRes> {
    return await this._passwordResetService.reset(token, email, newPassword);
  }
  /**
   *
   * @param providerName
   * @param token
   * @param role
   * @returns
   */
  async providersSignin(
    providerName: string,
    token: string,
    role: string,
  ): Promise<{ user: UserResponseDto; tokens: ITokens }> {
    const provider = this.providerMap.get(providerName);

    if (!provider) throw new Error(`Unsupported provider: ${providerName}`);
    return await provider.signIn(token, role);
  }
}
