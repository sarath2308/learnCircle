import { OtpRes } from "../../types";
export interface IPasswordResetService {
  reqResetOtp(email: string, role: string): Promise<OtpRes>;
  resendOtp(email: string, role: string): Promise<OtpRes>;
  verify(email: string, otp: string): Promise<OtpRes>;
  reset(token: string, email: string, newPassword: string): Promise<OtpRes>;
}
