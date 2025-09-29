import api from "../api";

export interface UpdateAvatarResponse {
  profileImg: string;
  message: string;
}

export const profileApi = {
  getProfile: () => api.get("/learner/profile").then((res) => res.data),

  updateAvatar: (file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);

    return api
      .patch<UpdateAvatarResponse>("/learner/profile/avatar", formData)
      .then((res) => res.data);
  },

  updateEmail: (payload: { email: string }) =>
    api.patch("/learner/profile/email", payload).then((res) => res.data),

  updatePassword: (payload: { newPassword: string }) =>
    api.patch("/learner/profile/password", payload).then((res) => res.data),

  updateProfile: (payload: { name?: string; bio?: string }) =>
    api.patch("/learner/profile", payload).then((res) => res.data),
};
