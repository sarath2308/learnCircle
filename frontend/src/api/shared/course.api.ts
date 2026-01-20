import api from "../api";

export const courseApi = {
     getCourse: (courseId: string) => api.get(`/course/${courseId}`).then((res) => res.data),
}