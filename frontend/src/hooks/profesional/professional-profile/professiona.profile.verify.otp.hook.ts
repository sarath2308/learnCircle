import { PROFESSIONA_PROFILE_API } from "@/api/profesional/professional.profile.api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

export const useProfessionalVerifyOtpAndUpdate = () => {
  return useMutation({
    mutationFn: PROFESSIONA_PROFILE_API.UPDATE_EMAIL,
    onSuccess: () => {
      toast.success("Email Updated");
    },
    onError: (err: unknown) => {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message || "Something went wrong");
      } else {
        toast.error("Email not updated");
      }
    },
  });
};
