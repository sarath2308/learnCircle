import api from "../api";

export const courseApi = {
  createCourse: (payload: FormData) => api.post("/course", payload).then((res) => res.data),
  updatePrice: (payload: { id: string; type: "Free" | "Paid"; price: number; discount: number }) =>
    api.post(`/course/${payload.id}/pricing`, payload).then((res) => res.data),
};
