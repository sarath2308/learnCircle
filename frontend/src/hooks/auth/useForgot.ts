import { authApi } from "@/api/authApi";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
export const useForgotApi = () => {
  const forgotPassword = useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: (res) => {
      toast.success(res.message || "OTP sent successfully(P)");
    },
    onError: (err: any) => {
      // Axios stores the server response in err.response
      const message = err.response?.data?.message || "Something went wrong";
      toast.error(message);
    },
  });
  return forgotPassword;
};
