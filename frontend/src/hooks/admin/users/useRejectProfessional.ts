import { userManagementApi } from "@/api/admin/userManagementApi";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

export const useRejectProfessional = () => {
  return useMutation({
    mutationKey: ["rejectProfessional"],
    mutationFn: userManagementApi.rejectProfessional,
    onSuccess: (res) => {
      toast.success(res.message || "Rejected");
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
