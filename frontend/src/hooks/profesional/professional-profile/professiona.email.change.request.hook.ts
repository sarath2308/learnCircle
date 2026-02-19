import { PROFESSIONA_PROFILE_API } from "@/api/profesional/professional.profile.api";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useProfessionalEmailChangeRequest = () => {
  return useMutation({
    mutationFn: PROFESSIONA_PROFILE_API.REQUEST_EMAIL_OTP,
    onSuccess: () => {
      toast.success("Otp Sent");
    },
    onError: () => {
      toast.error("Otp not sent try after sometimes");
    },
  });
};
