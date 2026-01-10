import { adminSubCategoryApi } from "@/api/admin/admin.sub.category";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

export const useUnBlockSubCategory = () => {
  return useMutation({
    mutationKey: ["unblock-category"],
    mutationFn: adminSubCategoryApi.unblockSubCategory,
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
