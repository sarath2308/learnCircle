import {
  LEARNER_COURSE_API,
  type LearnerGetAllCourseFilterType,
} from "@/api/learner/learner.course.api";
import { useQuery } from "@tanstack/react-query";

export const useGetAllCourseForLearner = (filter: LearnerGetAllCourseFilterType) => {
  return useQuery({
    queryKey: ["get-all-course-learner", filter],
    queryFn: () => LEARNER_COURSE_API.getAllCourseForLearner(filter),
    keepPreviousData: true,
  } as any);
};
