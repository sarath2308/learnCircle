import { PROFESSIONA_PROFILE_API } from "@/api/profesional/professional.profile.api";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

export const useProfessionalUpdatePassword = () => {
  return useMutation({
    mutationFn: ({ oldPassword, newPassword }: { oldPassword: string; newPassword: string }) =>
      PROFESSIONA_PROFILE_API.CHANGE_PASSWORD(oldPassword, newPassword),
    onSuccess: () => {
      toast.success("Password Updated");
    },
    onError: (err: unknown) => {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          // Backend responded with an error
          const message =
            err.response.data?.message || err.response.data?.error || "Request failed";
          toast.error(message);
        } else if (err.request) {
          // Request was made but no response
          toast.error("Server not responding. Check your connection.");
        } else {
          // Axios config/setup error
          toast.error("Request setup failed.");
        }
      } else {
        // Non-Axios error = your bug
        toast.error("Unexpected error occurred.");
        console.error("Non-Axios error:", err);
      }
    },
  });
};
