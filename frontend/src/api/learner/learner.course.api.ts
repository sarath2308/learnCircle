import api from "../api";

export type LearnerGetAllCourseFilterType = {
  search?: string;
  sortDate?: number;
  sortPrice?: number;
  sortRating?: number;
  categoryId?: string;
  subCategoryId?: string;
  type?: string;
};
export const LEARNER_COURSE_API = {
  getLearnerCourse: (courseId: string) =>
    api.get(`/learner/course/${courseId}`).then((res) => res.data),
  getAllCourseForLearner: (filter: LearnerGetAllCourseFilterType) => {
    const params: Record<string, any> = {};

    if (filter.search) params.search = filter.search;
    if (filter.sortDate) params.sortDate = filter.sortDate;
    if (filter.sortPrice) params.sortPrice = filter.sortPrice;
    if (filter.sortRating) params.sortRating = filter.sortRating;
    if (filter.categoryId) params.categoryId = filter.categoryId;
    if (filter.subCategoryId) params.subCategoryId = filter.subCategoryId;
    if (filter.type === "Free" || filter.type === "Paid") params.type = filter.type;

    return api.get("/learner/course", { params }).then((res) => res.data);
  },
};
