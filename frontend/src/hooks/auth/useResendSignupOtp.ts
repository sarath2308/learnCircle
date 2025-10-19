import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api/authApi";

export const useResendSignupOtp = () => {
  const resendOtp = useMutation({
    mutationFn: authApi.resendSignupOtp,
    onSuccess: (res) => {
      toast.success(res.message || "OTP sent successfully");
    },
    onError: (err: any) => {
      // Axios stores the server response in err.response
      const message = err.response?.data?.message || "Something went wrong";
      toast.error(message);
    },
  });

  return resendOtp;
};
