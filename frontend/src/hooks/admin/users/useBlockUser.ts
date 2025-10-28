import { userManagementApi } from "@/api/admin/userManagementApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

export const useBlockUser = () => {
  const queryClient = useQueryClient();
  const block = useMutation({
    mutationKey: ["blockUser"],
    mutationFn: userManagementApi.blockUser,
    onSuccess: (res) => {
      toast.success(res.message || "use blocked");
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
    onError: (err: unknown) => {
      if (err instanceof AxiosError) {
        toast.error(err?.response?.data?.message || "failed to block");
      } else {
        toast.error("Something went Wrong");
      }
    },
  });
  return block;
};
