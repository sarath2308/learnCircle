import { UserResponseDto } from "@/schema/shared/auth.dto.schema";
import { ITokens } from "@/utils";
import { OtpRes } from "@/types";
import { Role } from "@/types";
export interface IAuthOrchestrator {
  reqSignup: (name: string, email: string, password: string, role: Role) => Promise<OtpRes>;
  signup: (email: string, otp: string) => Promise<{ user: UserResponseDto; tokens: ITokens }>;
  resendSignupOtp: (token: string) => Promise<OtpRes>;
  login: (
    email: string,
    password: string,
    role: string,
  ) => Promise<{ user: UserResponseDto; tokens: ITokens }>;
  forgotPassword: (email: string, role: string) => Promise<OtpRes>;
  verifyForgotOtp: (email: string, otp: string, role: string) => Promise<OtpRes>;
  resendForgotOtp: (email: string, role: string) => Promise<OtpRes>;
  resetPassword: (token: string, email: string, newPassword: string) => Promise<OtpRes>;
  providersSignin: (
    providerName: string,
    token: string,
    role: string,
  ) => Promise<{ user: UserResponseDto; tokens: ITokens }>;
}
