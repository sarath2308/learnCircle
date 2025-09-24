import { useMutation } from "@tanstack/react-query";
import { profileApi } from "@/api/learner/profileApi";
import { toast } from "react-toastify";

export const useUpdatEmail = () => {
  return useMutation({
    mutationFn: profileApi.updateEmail,
    onSuccess: () => {
      toast.success("Email Updated");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update Email");
    },
  });
};