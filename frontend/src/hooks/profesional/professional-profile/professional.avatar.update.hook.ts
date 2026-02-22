import { PROFESSIONA_PROFILE_API } from "@/api/profesional/professional.profile.api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

export const useProfessionalUpdateAvatar = () => {
  return useMutation({
    mutationFn: PROFESSIONA_PROFILE_API.CHANGE_PROFILE_AVATAR,
    onSuccess: () => {
      toast.success("Avatar Updated");
    },
    onError: (err: unknown) => {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message || "Something went wrong");
      } else {
        toast.error("Avatar not updated");
      }
    },
  });
};
