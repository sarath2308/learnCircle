import { PROFESSIONA_PROFILE_API } from "@/api/profesional/professional.profile.api";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useProfessionalVerifyOtpAndUpdate = () => {
  return useMutation({
    mutationFn: PROFESSIONA_PROFILE_API.UPDATE_EMAIL,
    onSuccess: () => {
      toast.success("Email Updated");
    },
    onError: () => {
      toast.error("Email Not Updated");
    },
  });
};
