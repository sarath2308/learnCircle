import api from "../api";

export const courseStep1Api = {
  createCourseDetails: (payload: FormData) => api.post("/course", payload).then((res) => res.data),
  getCourseDetails: (courseId: string) => api.get(`/course/${courseId}`).then((res) => res.data),
  editCourseDetails: (courseId: string, payload: FormData) =>
    api.patch(`/course/${courseId}`, payload).then((res) => res.data),
};
