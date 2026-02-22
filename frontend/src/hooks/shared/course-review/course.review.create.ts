import { COURSE_REVIEW_API } from "@/api/shared/course.review.api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

export const useCourseReviewCreate = () => {
  return useMutation({
    mutationFn: ({
      courseId,
      payload,
    }: {
      courseId: string;
      payload: { rating: number; comment?: string };
    }) => COURSE_REVIEW_API.CREATE(courseId, payload),
    onSuccess: () => {
      toast.success("Review Added");
    },
    onError: (err: unknown) => {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message || "Review Not Created");
      }
    },
  });
};
