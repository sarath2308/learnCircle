import { adminSubCategoryApi } from "@/api/admin/admin.sub.category";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

export const useBlockSubCategory = () => {
  return useMutation({
    mutationKey: ["block-sub-category"],
    mutationFn: adminSubCategoryApi.blockSubCategory,
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
