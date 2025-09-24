import { useMutation } from "@tanstack/react-query";
import { profileApi } from "@/api/learner/profileApi";
import { toast } from "react-toastify";

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: profileApi.updatePassword,
    onSuccess: () => {
      toast.success("Password updated");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed update password");
    },
  });
};