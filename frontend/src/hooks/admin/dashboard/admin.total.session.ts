import { DashboardApi } from "@/api/admin/dasboardApi";
import { useQuery } from "@tanstack/react-query";

export const useGetTotalSessionCount = () => {
  return useQuery({
    queryKey: ["get-session-count"],
    queryFn: DashboardApi.getTotalSession,
  });
};
