import api from "../api";

export const DashboardApi = {
  getDashboard: () => api.get("/admin/dashboard").then((res) => res.data),
  getTotalCourseCount: () => api.get("/course/admin/total-course").then((res) => res.data),
  getTotalSession: () => api.get("/session-booking/admin/total-session").then((res) => res.data),
};
