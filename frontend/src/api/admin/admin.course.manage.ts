import api from "../api";

export const adminCourseManagement = {
  getAllCourse: (page: number, limit: number) =>
    api.get(`admin/course?page=${page}&limit=${limit}`).then((res) => res.data),
  getCourse: (courseId: string) => api.get(`/admin/course/${courseId}`).then((res) => res.data),
  approveCourse: (courseId: string) =>
    api.patch(`/admin/course/${courseId}/approve`).then((res) => res.data),
  rejectCourse: (courseId: string, reason: string) =>
    api.patch(`/admin/course/${courseId}/reject`, { reason }).then((res) => res.data),
  blockCourse: (courseId: string, reason: string) =>
    api.patch(`/admin/course/${courseId}/block`, { reason }).then((res) => res.data),
  unblockCourse: (courseId: string) =>
    api.patch(`/admin/course/${courseId}/unblock`).then((res) => res.data),
};
