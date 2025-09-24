import type { useUpdatePassword } from "@/hooks/learner/useUpdatePassword";
import api from "../api";

export const profileApi = {

  getProfile: () =>
    api.get("/learner/profile").then((res) => res.data),

  updateAvatar: (file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);
    return api.patch("/learner/profile/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }).then((res) => res.data);
  },


  updateEmail: (payload: { email: string }) =>
    api.patch("/learner/profile/email", payload).then((res) => res.data),

   updatePassword: (payload: { newPassword: string }) =>
    api.patch("/learner/profile/email", payload).then((res) => res.data),


  updateProfile: (payload: { name?: string; bio?: string }) =>
    api.patch("/learner/profile", payload).then((res) => res.data),
};
