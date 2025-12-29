import { courseStep1Api } from "@/api/shared/course.create.step1.api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

export const useCreateCourse = () => {
  return useMutation({
    mutationFn: courseStep1Api.createCourseDetails,
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message || "Something went wrong");
      }
    },
  });
};
