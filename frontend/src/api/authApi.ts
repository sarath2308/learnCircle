import api from "./api";

export const authApi = {
  reqSignup: (payload: { name: string; email: string; password: string; role: string }) =>
    api.post("/auth/request-signup", payload).then((res) => res.data),

  signupWithOtp: (payload: { email: string; otp: string; role: string }) =>
    api.post("/auth/signup", payload).then((res) => res.data),

  resendSignupOtp: (payload: { email: string; role: string }) =>
    api.post("/auth/signup/resend-otp", payload).then((res) => res.data),

  forgotPassword: (payload: { email: string; role: string }) =>
    api.post("/auth/forgot", payload).then((res) => res.data),

  verifyForgotOtp: (payload: { email: string; otp: string }) =>
    api.post("/auth/forgot/verify-otp", payload).then((res) => res.data),

  resendForgotOtp: (payload: { email: string }) =>
    api.post("/auth/forgot/resend-otp", payload).then((res) => res.data),

  resetPassword: (payload: { role: string | null; newPassword: string }) =>
    api.put("/auth/reset-password", payload).then((res) => res.data),

  googleAuth: (payload: { role: string | null; token: string | null }) =>
    api.post("/auth/google", payload).then((res) => res.data),

  logOut: () => api.post("/auth/logout").then((res) => res.data),
};
