import { useMutation } from "@tanstack/react-query";
import { profileApi } from "@/api/learner/profileApi";
import { toast } from "react-toastify";

export const useUpdateAvatar = () => {
  return useMutation({
    mutationFn: profileApi.updateAvatar,
    onSuccess: () => {
      toast.success("Profile picture updated");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed update profile");
    },
  });
};