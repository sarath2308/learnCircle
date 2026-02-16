import { COURSE_REVIEW_API } from "@/api/shared/course.review.api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

export const useCourseReviewUpdate = () => {
  return useMutation({
    mutationFn: ({
      reviewId,
      payload,
    }: {
      reviewId: string;
      payload: { rating?: number; comment?: string };
    }) => COURSE_REVIEW_API.UPDATE(reviewId, payload),
    onSuccess: () => {
      toast.success("Review Updated");
    },
    onError: (err: unknown) => {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message || "Review Updated");
      }
    },
  });
};
