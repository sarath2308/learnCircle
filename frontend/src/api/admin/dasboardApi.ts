import api from "../api";

export const DashboardApi = {
  getDashboard: () => api.get("/admin/dashbaord").then((res) => res.data),
};
