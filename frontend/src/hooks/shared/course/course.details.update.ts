import { courseStep1Api } from "@/api/shared/course.create.step1.api";
import { useMutation } from "@tanstack/react-query";

export const useCourseDetailsUpdate = () => {
  return useMutation({
    mutationKey: ["course-create_step1-update"],
    mutationFn: ({ courseId, payload }: { courseId: string; payload: FormData }) => {
      return courseStep1Api.updateCourseDetails(courseId, payload);
    },
  });
};
