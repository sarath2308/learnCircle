import { profileApi } from "@/api/learner/profileApi";
import { useQuery } from "@tanstack/react-query";

interface GetProfileAUrlApiResponse {
  success: boolean;
  message: string;
  profileUrl: string;
}
type ProfileUrlResponse = string;

export const useGetProfileUrl = () => {
  const getProfileUrl = useQuery<GetProfileAUrlApiResponse, Error, ProfileUrlResponse>({
    queryKey: ["getProfileUrl"],
    queryFn: profileApi.getProfileUrl,
    select: (response: GetProfileAUrlApiResponse) => response.profileUrl,
    enabled: false,
  });
  return {
    ...getProfileUrl,
    fetchProfileUrl: getProfileUrl.refetch,
  };
};
