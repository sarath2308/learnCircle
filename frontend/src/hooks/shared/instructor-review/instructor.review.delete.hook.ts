import { INSTRUCTOR_REVIEW_API } from "@/api/shared/instructor.review.api";
import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

export const useInstructorReviewDelete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: INSTRUCTOR_REVIEW_API.DELETE,
    onSuccess: () => {
      toast.success("review deleted");
      queryClient.invalidateQueries({ queryKey: ["get-instructor-review"] });
    },
    onError: (err: unknown) => {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message || "review not deleted");
      } else {
        toast.error("Something went wrong");
      }
    },
  });
};
