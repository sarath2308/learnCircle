import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { verificationApi } from "@/api/profesional/verificationApi";

export const useVerification = () => {
  return useMutation({
    mutationFn: verificationApi.verification,
    onSuccess: () => {
      toast.success("verification under process");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "failed to verify");
    },
  });
};
