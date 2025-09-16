import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/api/authApi";
import { toast } from "react-toastify";

export const useGoogle = () => {

  return useMutation({
    mutationFn: authApi.googleAuth,
    onSuccess: () => {
      toast.success("Sign successfull");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to login");
    },
  });
};