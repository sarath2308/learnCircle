import { userManagementApi } from "@/api/admin/userManagementApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

export const useApproveProfessional = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["approveProfessional"],
    mutationFn: userManagementApi.approveProfessional,
    onSuccess: (res) => {
      toast.success(res.message || "approved");
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message);
      } else {
        toast("Something went wrong");
      }
    },
  });
};
