import { categoryApi } from "@/api/admin/category.api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

export const useUnBlockCategory = () => {
  return useMutation({
    mutationKey: ["unblock-category"],
    mutationFn: categoryApi.unblockCategory,
    onSuccess: (res) => {
      toast.success(res?.message || "category unblocked");
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(err?.response?.data.message);
      } else {
        toast("Something went wrong");
      }
    },
  });
};
