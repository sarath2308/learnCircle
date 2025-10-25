import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api/authApi";
import toast from "react-hot-toast";
export const useForgotOtpVerify = () => {
  const verifyOtp = useMutation({
    mutationFn: authApi.verifyForgotOtp,
    onSuccess: (res) => {
      toast.success(res.message || "Otp Verified");
    },
    onError: (err: any) => {
      // Axios stores the server response in err.response
      const message = err.response?.data?.message || "Something went wrong";
      toast.error(message);
    },
  });

  return verifyOtp;
};
