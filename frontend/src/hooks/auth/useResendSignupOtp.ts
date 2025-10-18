import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api/authApi";

export const useResendSignupOtp = () => {
  const resendOtp = useMutation({
    mutationFn: authApi.resendSignupOtp,
    onSuccess: (res) => {
      toast.success(res.message || "OTP sent successfully");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return resendOtp;
};
