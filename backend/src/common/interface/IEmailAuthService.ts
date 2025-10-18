import { OtpRes } from "../types";
import { UserResponseDto } from "../dtos";
import { ITokens } from "../utils";
export interface IEmailAuthService {
  reqSignup(data: {
    name: string;
    email: string;
    password: string;
    role: "learner" | "professional" | "admin";
  }): Promise<OtpRes | null>;
  resendSignupOtp(email: string): Promise<OtpRes | null>;
  signup(
    email: string,
    otp: string,
  ): Promise<{ user: UserResponseDto; tokens: ITokens } | null>;
  login(
    email: string,
    password: string,
    role: string,
  ): Promise<{ user: UserResponseDto; tokens: ITokens } | null>;
}
