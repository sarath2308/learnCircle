import { userManagementApi } from "@/api/admin/userManagementApi";
import { useQuery } from "@tanstack/react-query";

export type LearnerData = {
  id: string;
  userId: string;
  name: string;
  email: string;
  isBlocked: boolean;
  profileUrl: string | null;
};

export type ProfessionalData = {
  _id: string;
  userId: string;
  status?: string | null;
  rating?: number | null;
  totalSessions?: number | null;
  profileUrl: string | null;
  resumeUrl: string | null;
};

export interface GetUsersResponse {
  success: boolean;
  message: string;
  learnerData: LearnerData[];
  professionalData: ProfessionalData[];
}

// ✅ assuming you’ll add this method in DashboardApi (or a separate AdminUserApi)
export const useGetUsers = () => {
  return useQuery({
    queryKey: ["adminUsers"],
    queryFn: userManagementApi.getUsers, // 👈 replace with the correct API call
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
    select: (res: GetUsersResponse) => ({
      learners: res.learnerData,
      professionals: res.professionalData,
    }),
  });
};
