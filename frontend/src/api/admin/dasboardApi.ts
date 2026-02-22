import api from "../api";

export const DashboardApi = {
  getDashboard: () => api.get("/admin/dashboard").then((res) => res.data),
};
