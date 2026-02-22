import api from "../api";

export const PROFESSIONA_PROFILE_API = {
  GET_PROFILE: () => api.get("/professional/profile").then((res) => res.data),
  CHANGE_PROFILE_AVATAR: (formData: FormData) =>
    api.patch("/professional/profile/avatar", formData).then((res) => res.data),
  UPDATE_PROFILE: (payload: {
    name: string;
    title: string;
    companyName: string;
    experience: number;
    bio: string;
  }) => api.patch("/professional/profile", payload).then((res) => res.data),
  REQUEST_EMAIL_OTP: (payload: { newEmail: string }) =>
    api.post("/professional/profile/change-email", payload).then((res) => res.data),
  UPDATE_EMAIL: (otp: string) =>
    api.post("/professional/profile/change-email/verify-otp", { otp }).then((res) => res.data),
  CHANGE_PASSWORD: (oldPassword: string, newPassword: string) =>
    api
      .post("/professional/profile/change-password", { oldPassword, newPassword })
      .then((res) => res.data),

  LOGOUT: () => api.post("/professional/profile/logout").then((res) => res.data),
};
