import api from "../api";

export const INSTRUCTOR_REVIEW_API = {
  CREATE: (instructorId: string, payload: { rating: number; comment?: string }) =>
    api.post(`/instructor-review/${instructorId}`, payload).then((res) => res.data),
  UPDATE: (reviewId: string, payload: { rating?: number; comment?: string }) =>
    api.patch(`/instructor-review/${reviewId}`, payload).then((res) => res.data),
  DELETE: (reviewId: string) =>
    api.delete(`/instructor-review/${reviewId}`).then((res) => res.data),
  GET_BY_INSTRUCTOR: (instructorId: string) =>
    api.get(`/instructor-review/${instructorId}`).then((res) => res.data),
};
