import { userManagementApi } from "@/api/admin/userManagementApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

export const useRejectProfessional = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["rejectProfessional"],
    mutationFn: userManagementApi.rejectProfessional,
    onSuccess: (res) => {
      toast.success(res.message || "Rejected");
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
