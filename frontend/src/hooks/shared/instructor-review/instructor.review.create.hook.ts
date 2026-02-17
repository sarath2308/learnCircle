import { COURSE_REVIEW_API } from "@/api/shared/course.review.api";
import { INSTRUCTOR_REVIEW_API } from "@/api/shared/instructor.review.api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

export const useInstructorReviewCreate = () => {
  return useMutation({
    mutationFn: ({
      instructorId,
      payload,
    }: {
      instructorId: string;
      payload: { rating: number; comment?: string };
    }) => INSTRUCTOR_REVIEW_API.CREATE(instructorId, payload),
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
