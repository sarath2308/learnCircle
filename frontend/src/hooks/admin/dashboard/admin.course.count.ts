import { DashboardApi } from "@/api/admin/dasboardApi";
import { useQuery } from "@tanstack/react-query";

export const useGetTotalCourseCount = () => {
  return useQuery({
    queryKey: ["get-course-count"],
    queryFn: DashboardApi.getTotalCourseCount,
  });
};
