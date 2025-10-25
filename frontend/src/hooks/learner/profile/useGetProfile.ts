import { useQuery } from "@tanstack/react-query";
import { profileApi } from "@/api/learner/profileApi";

export interface GetProfileResponse {
  id: string | null;
  name: string;
  email: string;
  role: string;
  profileImg: string | null;
  currentSubject: string | null;
  joinedAt: string | null;
  lastLogin: string | null;
  streak?: number;
  hasPassword: boolean;
  isBlocked: boolean;
}

export interface ProfileApiResponse {
  success: boolean;
  userData: GetProfileResponse;
  message: string;
}

export const useGetProfile = () => {
  return useQuery<ProfileApiResponse, Error, GetProfileResponse>({
    queryKey: ["profile"],
    queryFn: profileApi.getProfile,
    staleTime: 5 * 60 * 1000,
    select: (response: ProfileApiResponse) => response.userData,
  });
};
