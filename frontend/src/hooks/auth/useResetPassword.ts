import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api/authApi";
import toast from "react-hot-toast";

export const useResetPassword = () => {
  const resetPassword = useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: (res) => {
      toast.success(res.message || "Password Changed");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to reset password");
    },
  });
  return resetPassword;
};
