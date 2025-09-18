export interface IAuthService<T> {
  signup: (name: string, email: string, password: string) => Promise<object>;
  login: (email: string, password: string) => Promise<any>;
  forgotPassword: (email: string) => Promise<object>;
  resetPassword: (token: string, newPassword: string) => Promise<{ message: string } | void>;
  verifyOtp: (email: string, otp: string, type: string) => Promise<any>;
  resendOtp: (email: string, type: string) => Promise<object | void>;
  googleSign: (token: string) => Promise<{ user: Partial<T>; accessToken: string }>;
}
