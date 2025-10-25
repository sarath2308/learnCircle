import { useMutation } from "@tanstack/react-query";
import { profileApi } from "@/api/learner/profileApi";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: profileApi.updatePassword,
    onSuccess: () => {
      toast.success("Password updated");
    },
    onError: (err: unknown) => {
      if (err instanceof AxiosError) {
        toast.error("Failed update password123567");
      } else {
        toast.error("failed to update password");
      }
    },
  });
};
