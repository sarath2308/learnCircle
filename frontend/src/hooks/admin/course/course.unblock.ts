import { adminCourseManagement } from "@/api/admin/admin.course.manage";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useUnblockCourse = () => {
  return useMutation({
    mutationFn: (courseId: string) => adminCourseManagement.unblockCourse(courseId),
    onSuccess: () => {
      toast.success("Course unblocked successfully");
    },
    onError: () => {
      toast.error("Failed to unblock course, try again later");
    },
  });
};
