import { DashboardApi } from "@/api/admin/dasboardApi";
import { useQuery } from "@tanstack/react-query";

export const useGetAdminDashboard = () => {
  return useQuery({
    queryKey: ["adminDashboard"],
    queryFn: DashboardApi.getDashboard,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
