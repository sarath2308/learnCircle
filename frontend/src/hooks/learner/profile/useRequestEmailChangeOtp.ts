import { profileApi } from "@/api/learner/profileApi";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

export const useRequestEmailChangeOtp = () => {
  const getOtp = useMutation({
    mutationFn: profileApi.requestChangeEmailOtp,
    mutationKey: ["RequestEmailChangeOtp"],
    onSuccess: (res) => {
      toast.success(res.message);
    },
    onError: (err: unknown) => {
      if (err instanceof AxiosError) {
        toast.error(err?.response?.data?.message || "Failed to send otp");
      } else {
        toast.error("Failed to send otp");
      }
    },
  });
  return getOtp;
};
