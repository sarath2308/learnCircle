import api from "../api";

export const courseStep1Api = {
  createCourseDetails: (payload: FormData) => api.post("/course", payload).then((res) => res.data),
  updatePriceDetails: (
    courseId: string,
    payload: { type: string; price: number; discount: number; status: string },
  ) => api.patch(`/course/${courseId}/pricing`, payload).then((res) => res.data),
};
