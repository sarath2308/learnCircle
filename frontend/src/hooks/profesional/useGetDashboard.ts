import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/api/profesional/dashboardApi";

interface GetDashboardResponse {
  name: string;
  email: string;
  joinedAt: Date;
  isBlocked: boolean;
  RejectReason: string;
  role: string;
  status: string;
}

interface ProfileApiResponse {
  user: GetDashboardResponse;
  message: string;
}

export const useGetDashboard = () => {
  return useQuery<GetDashboardResponse>({
    queryKey: ["dashboard"],
    queryFn: async () => {
      try {
        const response: ProfileApiResponse = await dashboardApi.getDashboard();
        const data = response.user;
        console.log(data);
        return data;
      } catch (err: any) {
        console.error(err);
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};
