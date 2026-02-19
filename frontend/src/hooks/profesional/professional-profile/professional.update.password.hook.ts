import { PROFESSIONA_PROFILE_API } from "@/api/profesional/professional.profile.api";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useProfessionalUpdatePassword = () => {
  return useMutation({
    mutationFn: ({ oldPassword, newPassword }: { oldPassword: string; newPassword: string }) =>
      PROFESSIONA_PROFILE_API.CHANGE_PASSWORD(oldPassword, newPassword),
    onSuccess: () => {
      toast.success("Password Updated");
    },
    onError: () => {
      toast.error("Password not updated");
    },
  });
};
