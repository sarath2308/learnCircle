import { courseApi } from "@/api/shared/course.api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

export const useUpdateCoursePricing = () => {
  return useMutation({
    mutationFn: courseApi.updatePrice,
    onSuccess: (res) => {
      toast.success(res.message || "Course Created");
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message || "Something went wrong");
      }
    },
  });
};
