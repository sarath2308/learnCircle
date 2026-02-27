import api from "../api";

export const PROFESSIONAL_SESSION_API = {
  GET_ALL_BOOKINGS_FOR_INSTRUCTOR: () =>
    api.get("/professional/sessions-bookings/").then((res) => res.data),
  MARK_SESSION_AS_COMPLETED: (sessionId: string) =>
    api.post(`/professional/sessions-bookings/${sessionId}/mark-completed`).then((res) => res.data),
  GET_SESSION_DATA_FOR_DASHBOARD: () =>
    api.get("/professional/sessions-bookings/dashboard").then((res) => res.data),
};
