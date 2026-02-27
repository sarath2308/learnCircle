import { PROFESSIONAL_COURSE_API } from "@/api/profesional/professiona.course.api";
import { useQuery } from "@tanstack/react-query";

export const useGetTotalCourseOfInstructor = () => {
  return useQuery({
    queryKey: ["get-total-course"],
    queryFn: PROFESSIONAL_COURSE_API.GET_TOTAL_COURSE_COUNT,
  });
};
