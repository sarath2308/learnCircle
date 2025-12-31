import { LessonApi } from "@/api/shared/lesson.api";
import { useMutation } from "@tanstack/react-query";

export const useLessonCreate = () => {
  return useMutation({
    mutationKey: ["create-lesson"],
    mutationFn: ({ chapterId, payload }: { chapterId: string; payload: FormData }) =>
      LessonApi.CREATE_LESSON(chapterId, payload),
  });
};
