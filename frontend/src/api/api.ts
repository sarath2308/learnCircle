import { clearCurrentUser } from "@/redux/slice/currentUserSlice";
import axios from "axios";
import { store } from "@/redux/store";


const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_API,
  withCredentials: true,
});

const MAX_REFRESH_ATTEMPTS = 1;

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    // If error is not 401, reject immediately
    if (err.response?.status !== 401) return Promise.reject(err);

    // Skip refresh for login/signup or refresh endpoints themselves
    if (
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/refresh-token") ||
      originalRequest.url?.includes("/auth/signup") ||
      originalRequest.url?.includes("/auth/request-signup")
    ) {
      return Promise.reject(err);
    }

    // Initialize retry counter
    originalRequest._retryCount = originalRequest._retryCount || 0;

    if (originalRequest._retryCount >= MAX_REFRESH_ATTEMPTS) {
      // Too many retries, logout user or redirect
      window.location.href = "/";
      return Promise.reject(err);
    }

    originalRequest._retryCount++;

    try {
      await api.post("/auth/refresh-token");
      console.log("Refresh token called from frontend");
      await new Promise((res) => window.setTimeout(res, 50));
      return api(originalRequest); // Retry original request
    } catch (refreshError) {
      // Refresh failed (maybe expired), redirect to login
      store.dispatch(clearCurrentUser())
      window.location.href = "/";
      return Promise.reject(refreshError);
    }
  },
);

export default api;
