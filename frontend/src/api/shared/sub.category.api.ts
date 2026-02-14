import api from "../api";

export const subCategoryApi = {
  getSubCategories: (categoryId: string) =>
    api.get(`category/${categoryId}/sub-categories`).then((res) => res.data),
};
