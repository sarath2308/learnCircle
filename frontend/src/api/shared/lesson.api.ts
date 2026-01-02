import api from "../api";

export const LessonApi = {
  CREATE_LESSON: (chapterId: string, payload: FormData) =>
    api.post(`course/chapter/${chapterId}/lesson`, payload).then((res) => res.data),
  CREATE_LESSON_WITH_VIDEO: (chapterId: string, payload: FormData) =>
    api.post(`course/chapter/${chapterId}/lesson/video`, payload).then((res) => res.data),
  FINALIZE_LESSON_VIDEO: (lessonId: string) =>
    api.patch(`/course/chapter/lesson/${lessonId}/finalize`).then((res) => res.data),
  GET_LESSON_BY_ID: (lessonId: string) =>
    api.get(`/course/chapter/lesson/${lessonId}`).then((res) => res.data),
  UPDATE_LESSON: (lessonId: string, payload: FormData) =>
    api.put(`course/chapter/lesson/${lessonId}`, payload).then((res) => res.data),
  DELETE_LESSON: (lessonId: string) =>
    api.delete(`course/chapter/lesson/${lessonId}`).then((res) => res.data),
  CHANGE_LESSON_ORDER: (lessonId: string, payload: FormData) =>
    api.put(`course/chapter/lesson/${lessonId}/change-order`, payload).then((res) => res.data),
};
