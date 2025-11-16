import { OtpRes } from "@/types";
import { UserResponseDto } from "@/schema/shared/auth.dto.schema";
import { ITokens } from "@/utils";
export interface IEmailAuthService {
  reqSignup(data: {
    name: string;
    email: string;
    password: string;
    role: "learner" | "professional" | "admin";
  }): Promise<OtpRes>;
  resendSignupOtp(email: string): Promise<OtpRes>;
  signup(email: string, otp: string): Promise<{ user: UserResponseDto; tokens: ITokens }>;
  login(
    email: string,
    password: string,
    role: string,
  ): Promise<{ user: UserResponseDto; tokens: ITokens }>;
}
