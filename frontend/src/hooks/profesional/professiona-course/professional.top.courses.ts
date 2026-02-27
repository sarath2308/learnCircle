import { PROFESSIONAL_COURSE_API } from "@/api/profesional/professiona.course.api";
import { useQuery } from "@tanstack/react-query";

export const useGetTopCoursesOfInstructor = () => {
  return useQuery({
    queryKey: ["get-top-course"],
    queryFn: PROFESSIONAL_COURSE_API.GET_TOP_COURSES,
  });
};
