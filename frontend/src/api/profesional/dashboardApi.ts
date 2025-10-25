import api from "../api";

export interface UpdateAvatarResponse {
  profileImg: string;
  message: string;
}

export const dashboardApi = {
  getDashboard: () => api.get("/profesional/dashboard").then((res) => res.data),
  getProfileInfo: () => api.get("/profesional/profileinfo").then((res) => res.data),
};
