import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { verificationApi } from "@/api/profesional/verificationApi";

export const useVerification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: verificationApi.verification,
    onSuccess: () => {
      toast.success("verification under process");
      queryClient.invalidateQueries({ queryKey: ["ProfessionalDashboard"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "failed to verify");
    },
  });
};
