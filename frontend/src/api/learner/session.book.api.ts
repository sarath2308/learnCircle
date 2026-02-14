import api from "../api";

export const SESSION_API = {
  BOOK_SESSION: (payload: {
    startTime: string;
    endTime: string;
    instructorId: string;
    date: string;
    price: number;
    typeOfSession: string;
  }) => api.post("/learner/session-booking/create", payload).then((res) => res.data),
  GET_SESSIONS: () => api.get("/learner/session-booking/my-bookings").then((res) => res.data),
  CONFIRM_SESSION: (sessionBookingId: string) =>
    api.post(`/learner/session-booking/confirm/${sessionBookingId}`).then((res) => res.data),
};
