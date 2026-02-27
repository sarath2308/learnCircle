import api from "../api";

export const PROFESSIONAL_COURSE_API = {
  GET_TOTAL_COURSE_COUNT: () =>
    api.get("/course/professional/total-course").then((res) => res.data),
  GET_TOTAL_ENROLLED_COUNT: () =>
    api.get("/course/professional/total-enrolled").then((res) => res.data),
  GET_TOP_COURSES: () => api.get("/course/professional/top-course").then((res) => res.data),
};
