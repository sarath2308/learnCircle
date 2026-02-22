import api from "../api";

export const COURSE_REVIEW_API = {
  CREATE: (courseId: string, payload: { rating: number; comment?: string }) =>
    api.post(`/course-review/${courseId}`, payload).then((res) => res.data),
  UPDATE: (reviewId: string, payload: { rating?: number; comment?: string }) =>
    api.patch(`/course-review/${reviewId}`, payload).then((res) => res.data),
  GET_BY_COURSE: (courseId: string) =>
    api.get(`/course-review/${courseId}`).then((res) => res.data),
  DELETE: (reviewId: string) => api.delete(`/course-review/${reviewId}`).then((res) => res.data),
};
