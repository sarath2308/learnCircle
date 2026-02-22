import api from "../api";

export const adminSubCategoryApi = {
  listSubCategory: (page: number, limit: number, search: string, categoryId: string) =>
    api
      .get(
        `/admin/category/sub-category?page=${page}&limit=${limit}&search=${search}&categoryId=${categoryId}`,
      )
      .then((res) => res.data),
  createSubCategory: (payload: { name: string; categoryId: string }) =>
    api.post("/admin/category/sub-category", payload).then((res) => res.data),
  updateSubCategory: ({
    id,
    payload,
  }: {
    id: string;
    payload: { name: string; categoryId: string };
  }) => api.patch(`/admin/category/sub-category/${id}`, payload).then((res) => res.data),
  blockSubCategory: (payload: { id: string }) =>
    api.patch(`/admin/category/sub-category/block/${payload.id}`).then((res) => res.data),
  unblockSubCategory: (payload: { id: string }) =>
    api.patch(`/admin/category/sub-category/unblock/${payload.id}`).then((res) => res.data),
};
