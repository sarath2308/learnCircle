import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api/authApi";
import toast from "react-hot-toast";
export const useForgotOtpVerify = () => {
  const verifyOtp = useMutation({
    mutationFn: authApi.verifyForgotOtp,
    onSuccess: (res) => {
      toast.success(res.message || "Otp Verified");
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong");
    },
  });

  return verifyOtp;
};
