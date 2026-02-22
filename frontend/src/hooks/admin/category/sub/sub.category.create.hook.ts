import { adminSubCategoryApi } from "@/api/admin/admin.sub.category";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

export const useCreateSubCategory = () => {
  return useMutation({
    mutationKey: ["create-sub-category"],
    mutationFn: adminSubCategoryApi.createSubCategory,
    onSuccess: (res) => {
      toast.success(res?.message || "category created");
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
