import { profileApi } from "@/api/learner/profileApi";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

export const useVerifyAndUpdateEmail = () => {
  const getOtp = useMutation({
    mutationFn: profileApi.verifyAndChangeEmail,
    mutationKey: ["RequestEmailChangeOtp"],
    onSuccess: (res) => {
      toast.success(res.message);
    },
    onError: (err: unknown) => {
      if (err instanceof AxiosError) {
        toast.error(err?.response?.data?.message || "Failed to update profile");
      } else {
        toast.error("Failed to send otp");
      }
    },
  });
  return getOtp;
};
