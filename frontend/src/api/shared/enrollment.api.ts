import api from "../api";

export const ENROLLMENT_API = {
  ENROLL_USER: (courseId: string) => api.post(`/course/${courseId}/enroll`).then((res) => res.data),
};
