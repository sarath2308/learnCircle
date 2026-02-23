import { profileApi } from "@/api/learner/profileApi";
import { useMutation } from "@tanstack/react-query";

export const useResendEmailChangeOtp = () => {
  return useMutation({
    mutationFn: () => profileApi.resendChangeEmailOtp(),
  });
};
