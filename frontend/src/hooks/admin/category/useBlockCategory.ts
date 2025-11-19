import { categoryApi } from "@/api/admin/category.api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

export const useBlockCategory = () => {
  return useMutation({
    mutationKey: ["block-category"],
    mutationFn: categoryApi.blockCategory,
    onSuccess: (res) => {
      toast.success(res?.message || "category Blocked");
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
