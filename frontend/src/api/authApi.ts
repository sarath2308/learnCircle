import api from "./api";

export const authApi = {
  resetPassword: (payload: { role: string | null; token: string | null; newPassword: string }) =>
    api.put(`/auth/${payload.role}/reset-password`, payload).then((res) => res.data),
  googleAuth: (payload: { role: string | null; token: string | null }) =>
    api.post(`/auth/${payload.role}/google`, payload).then((res) => res.data),
  logOut: () => api.post("/auth/logout").then((res) => res.data),
};
