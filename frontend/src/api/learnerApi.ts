import api from "./api";

export const learnerApi = {
  getAll: () => api.get("/users").then((res) => res.data),
  getById: (id: string) => api.get(`/users/${id}`).then((res) => res.data),
  create: (payload: { name: string; email: string }) =>
   api.post("/users", payload).then((res) => res.data),
  update: (id: string, payload: { name?: string; email?: string }) =>
    api.put(`/users/${id}`, payload).then((res) => res.data),
  delete: (id: string) => api.delete(`/users/${id}`).then((res) => res.data),
};
