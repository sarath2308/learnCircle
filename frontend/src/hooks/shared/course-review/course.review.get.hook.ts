import { COURSE_REVIEW_API } from "@/api/shared/course.review.api";
import { useQuery } from "@tanstack/react-query";

export const useGetCourseReviewForView = (courseId: string) => {
  return useQuery({
    queryKey: ["get-course-review-view"],
    queryFn: () => COURSE_REVIEW_API.GET_BY_COURSE(courseId),
  });
};
