import { profileApi } from "@/api/learner/profileApi";
import { useQuery } from "@tanstack/react-query";

export const useResendEmailChangeOtp = () => {
  const getOtp = useQuery({
    queryKey: ["ResendEmailChangeOtp"],
    queryFn: profileApi.getProfileUrl,
    enabled: false,
  });
  return {
    ...getOtp,
    getResendEmailChangeOtp: getOtp.refetch,
  };
};
