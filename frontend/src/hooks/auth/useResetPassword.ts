import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/api/authApi";
import { toast } from "react-toastify";

export const useResetPassword = () => {
  return useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      toast.success("Password Changed successfully");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to reset password");
    },
  });
};
