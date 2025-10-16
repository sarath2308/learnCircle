import { OtpRes } from "../types";
export interface IPasswordResetService {
  reqResetOtp(email: string, role: string): Promise<OtpRes | null>;
  resendOtp(email: string, role: string): Promise<OtpRes | null>;
  verify(email: string, otp: string): Promise<OtpRes | null>;
  reset(token: string, email: string, newPassword: string): Promise<OtpRes | null>;
}
