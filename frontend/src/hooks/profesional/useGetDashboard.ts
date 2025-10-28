import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/api/profesional/dashboardApi";

export interface GetDashboardResponse {
  id: string;
  user: { id: string; name: string; email: string };
  bio: string;
  companyName: string;
  experience: number;
  profileUrl: string;
  resumeUrl: string;
  rating: number;
  sessionPrice?: number;
  skills: string[];
  title?: string;
  totalSessions: number;
  typesOfSessions: string[];
  status: string;
  rejectReason?: string;
}

interface DashboardApiResponse {
  success: boolean;
  message: string;
  userData: GetDashboardResponse;
}

export const useGetDashboard = () => {
  return useQuery<GetDashboardResponse, Error>({
    queryKey: ["ProfessionalDashboard"],
    queryFn: async () => {
      const response = await dashboardApi.getDashboard();
      return response.userData;
    },
    refetchInterval: 5000,
  });
};
