import api from "./api";

export const authApi = {
  resetPassword: (payload: { role: string|null; token:string|null,newPassword: string }) =>
    api.post(`/auth/${payload.role}/reset-password`, payload).then((res) => res.data),
};
