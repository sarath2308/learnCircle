import { authApi } from "@/api/authApi";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useResendForgotOtp = () => {
  const resendOtp = useMutation({
    mutationFn: authApi.resendForgotOtp,
    onSuccess: (res) => {
      toast.success(res.message || "Otp sent Successfull");
    },
    onError: (err: any) => {
      // Axios stores the server response in err.response
      const message = err.response?.data?.message || "Something went wrong";
      toast.error(message);
    },
  });
  return resendOtp;
};
