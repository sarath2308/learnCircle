import { authApi } from "@/api/authApi";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
export const useForgotApi = () => {
  const forgotPassword = useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: (res) => {
      toast.success(res.message || "OTP sent successfully(P)");
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong");
    },
  });
  return forgotPassword;
};
