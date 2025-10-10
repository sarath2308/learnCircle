export interface IPasswordResetService {
  sendForgotPasswordOtp(email: string): Promise<void>;
  verifyForgotOtp(email: string, otp: string): Promise<string>;
  resetPassword(token: string, newPassword: string): Promise<void>;
}

export class PasswordResetService implements IPasswordResetService {
  constructor() {}
  async sendForgotPasswordOtp(email: string): Promise<void> {}
  async verifyForgotOtp(email: string, otp: string): Promise<string> {}
  async resetPassword(token: string, newPassword: string): Promise<void> {}
}
