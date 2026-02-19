import { PROFESSIONA_PROFILE_API } from "@/api/profesional/professional.profile.api";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useProfessionalProfileUpdate = () => {
  return useMutation({
    mutationFn: PROFESSIONA_PROFILE_API.UPDATE_PROFILE,
    onSuccess: () => {
      toast.success("Profile Updated");
    },
    onError: () => {
      toast.error("profile not updated");
    },
  });
};
