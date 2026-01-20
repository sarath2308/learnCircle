import api from "../api";

export const chapterApi = {
  createChapter: (
    courseId: string,
    payload: { title: string; description: string; order: number },
  ) => api.post(`course/${courseId}/chapter`, payload).then((res) => res.data),
  getChaptersByCourseId: (courseId: string) =>
    api.get(`course/${courseId}/chapters`).then((res) => res.data),
  updateChapter: (chapterId: string, payload: {
    title: string,
    description: string,
  }) =>
    api.patch(`course/chapter/${chapterId}`, payload).then((res) => res.data),
  deleteChapter: (chapterId: string) =>
    api.delete(`course/chapter/${chapterId}`).then((res) => res.data),
};
