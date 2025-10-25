import { UserResponseDto } from "../dtos";
import { ITokens } from "../utils";
import { OtpRes } from "../types";
import { Role } from "../types";
export interface IAuthOrchestrator {
  reqSignup: (name: string, email: string, password: string, role: Role) => Promise<OtpRes | null>;
  signup: (
    email: string,
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
  resetPassword: (token: string, email: string, newPassword: string) => Promise<OtpRes | null>;
  providersSignin: (
    providerName: string,
    token: string,
    role: string,
  ) => Promise<{ user: UserResponseDto; tokens: ITokens } | null>;
}
