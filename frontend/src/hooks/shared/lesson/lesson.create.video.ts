import { LessonApi } from "@/api/shared/lesson.api";
import { useMutation } from "@tanstack/react-query";

export const useLessonCreateWithVideo = () => {
  return useMutation({
    mutationKey: ["create-lesson-with-video"],
    mutationFn: ({ chapterId, payload }: { chapterId: string; payload: FormData }) =>
      LessonApi.CREATE_LESSON_WITH_VIDEO(chapterId, payload),
  });
};
