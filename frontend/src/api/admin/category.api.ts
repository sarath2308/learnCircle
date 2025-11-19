import api from "../api";

export const categoryApi = {
  listCategory: (page: number, limit: number, search: string) =>
    api.get(`/admin/category?page=${page}&limit=${limit}&search=${search}`).then((res) => res.data),
  createCategory: (payload: { name: string }) =>
    api.post("/admin/category", payload).then((res) => res.data),
  updateCategory: (payload: { name: string }) =>
    api.patch("/admin/category", payload).then((res) => res.data),
  blockCategory: (payload:{id: string}) => api.patch(`/admin/category/block/${payload.id}`).then((res) => res.data),
  unblockCategory: (payload:{id: string}) => api.patch(`/admin/category/unblock/${payload.id}`).then((res) => res.data),
};
