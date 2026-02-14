import api from "../api";

export const SHARED_SESSION_BOOKING_API = {
  CHECK_JOIN_PERMISSION: (bookingId: string) =>
    api.post(`/session-booking/${bookingId}/join`).then((res) => res.data),
};
