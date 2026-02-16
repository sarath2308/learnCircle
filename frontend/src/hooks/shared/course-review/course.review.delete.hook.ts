import { COURSE_REVIEW_API } from "@/api/shared/course.review.api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

export const useDeleteCourseReview = () => {
  return useMutation({
    mutationFn: COURSE_REVIEW_API.DELETE,
    onSuccess: () => {
      toast.success("Review Removed");
    },
    onError: (err: unknown) => {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message || "review not delted");
      } else {
        toast.error("Something went wrong");
      }
    },
  });
};
