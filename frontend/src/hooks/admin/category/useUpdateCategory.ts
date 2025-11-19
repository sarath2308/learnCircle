import { categoryApi } from "@/api/admin/category.api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

export const useUpdateCategory = () => {
  return useMutation({
    mutationKey: ["update-category"],
    mutationFn: categoryApi.updateCategory,
    onSuccess: (res) => {
      toast.success(res?.message || "category updated");
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
