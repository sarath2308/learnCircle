import { useQuery } from "@tanstack/react-query";
import { profileApi } from "@/api/learner/profileApi";

interface GetProfileResponse {
  name: string;
  email: string;
  role: string;
  profileImg: string;
  currentSubject: [];
  joinedAt: Date;
  lastLogin: Date;
  hasPassword: boolean;
}

interface ProfileApiResponse {
  user: GetProfileResponse;
  message: string;
}

export const useGetProfile = () => {
  return useQuery<GetProfileResponse>({
    queryKey: ["profile"],
    queryFn: async () => {
      try {
        const response: ProfileApiResponse = await profileApi.getProfile();
        const data = response.user;
        return data;
      } catch (err: any) {
        console.error(err);
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};
