import { PROFILE_API } from "@/contstant/learner/profile.api.constant";
import api from "../api";

export interface UpdateAvatarResponse {
  profileImg: string;
  message: string;
}

export const profileApi = {
  getProfile: () => api.get(PROFILE_API.GET_PROFILE).then((res) => res.data),

  updateAvatar: (file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);

    return api
      .patch<UpdateAvatarResponse>(PROFILE_API.UPDATE_AVATAR, formData)
      .then((res) => res.data);
  },
  updateName: (payload: { name: string }) =>
    api.patch(PROFILE_API.UPDATE_USERNAME, payload).then((res) => res.data),

  requestChangeEmailOtp: (payload: { newEmail: string }) =>
    api.post(PROFILE_API.EMAIL_REQUEST_OTP, payload).then((res) => res.data),

  resendChangeEmailOtp: () => api.get(PROFILE_API.EMAIL_RESEND_OTP).then((res) => res.data),

  verifyAndChangeEmail: (payload: { otp: string }) =>
    api.post(PROFILE_API.EMAIL_VERIFY_OTP, payload).then((res) => res.data),

  updatePassword: (payload: { newPassword: string; password?: string }) =>
    api.patch(PROFILE_API.UPDATE_PASSWORD, payload).then((res) => res.data),

  getProfileUrl: () => api.get(PROFILE_API.GET_PROFILE_URL).then((res) => res.data),
};
