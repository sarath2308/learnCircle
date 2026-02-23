import { adminCourseManagement } from "@/api/admin/admin.course.manage";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

export const useApproveCourse = () => {
  return useMutation({
    mutationFn: (courseId: string) => adminCourseManagement.approveCourse(courseId),
    onSuccess: () => {
      toast.success("Course approved successfully");
    },
    onError: (err: unknown) => {
      if (err instanceof AxiosError)
        toast.error(err.response?.data.message || "Failed to approve course, try again later");
      else toast.error("Something went wrong");
    },
  });
};
