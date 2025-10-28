import { userManagementApi } from "@/api/admin/userManagementApi";
import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

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

export interface GetLearnerResponse {
  success: boolean;
  message: string;
  data: LearnerData[];
}

export interface GetProfessionalResponse {
  success: boolean;
  message: string;
  data: ProfessionalData[];
}

interface UseAdminUsersParams<T extends "learner" | "professional"> {
  userType: T;
  page: number;
  search: string;
}

/**
 * ✅ Generic hook for learners and professionals
 * Compatible with TanStack Query v5
 */
export function useAdminUsers<T extends "learner" | "professional">({
  userType,
  page,
  search,
}: UseAdminUsersParams<T>): UseQueryResult<
  T extends "learner" ? GetLearnerResponse : GetProfessionalResponse,
  Error
> {
  return useQuery<
    T extends "learner" ? GetLearnerResponse : GetProfessionalResponse,
    Error
  >({
    queryKey: ["admin-users", userType, page, search],
    queryFn: async () =>
      userType === "learner"
        ? await userManagementApi.getLearnerData({ page, search })
        : await userManagementApi.getProfessionalData({ page, search }),

    // ✅ v5 syntax — keeps previous data during new fetch
    placeholderData: keepPreviousData,

    staleTime: 1000 * 60, // optional: cache fresh for 1 minute
  });
}
