import api from "../api";

export const userManagementApi = {
  getUsers: () => api.get("/admin/users").then((res) => res.data),
  blockUser: (payload: { userId: string }) =>
    api.patch("/admin/users/block-user", payload).then((res) => res.data),
  unblockUser: (payload: { userId: string }) =>
    api.patch("/admin/users/unblock-user", payload).then((res) => res.data),
  approveProfessional: (payload: { userId: string }) =>
    api.patch("/admin/users/approve-professional", payload).then((res) => res.data),
  rejectProfessional: (payload: { userId: string }) =>
    api.patch("/admin/users/reject-professional", payload).then((res) => res.data),
};
