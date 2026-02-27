import { PROFESSIONAL_COURSE_API } from "@/api/profesional/professiona.course.api";
import { useQuery } from "@tanstack/react-query";

export const useGetTotalEnrolledCount = () => {
  return useQuery({
    queryKey: ["get-total-enrolled"],
    queryFn: PROFESSIONAL_COURSE_API.GET_TOTAL_ENROLLED_COUNT,
  });
};
