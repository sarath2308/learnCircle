import api from "../api";

export const categoryApi = {
  getCategory: () => api.get("/category").then((res) => res.data),
};
