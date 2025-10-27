import { userManagementApi } from "@/api/admin/userManagementApi";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

export const useUnblockUser = () => {
  const block = useMutation({
    mutationKey: ["unblockUser"],
    mutationFn: userManagementApi.unblockUser,
    onSuccess: (res) => {
      toast.success(res.message || "use unblocked");
    },
    onError: (err: unknown) => {
      if (err instanceof AxiosError) {
        toast.error(err?.response?.data?.message || "error occured");
      } else {
        toast.error("Something went Wrong");
      }
    },
  });
  return block;
};
