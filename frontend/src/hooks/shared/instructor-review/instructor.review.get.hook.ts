import { INSTRUCTOR_REVIEW_API } from "@/api/shared/instructor.review.api";
import { useQuery } from "@tanstack/react-query";

export const useGetInstructorReview = (instructorId: string) => {
  return useQuery({
    queryKey: ["get-instructor-review"],
    queryFn: () => INSTRUCTOR_REVIEW_API.GET_BY_INSTRUCTOR(instructorId),
  });
};
