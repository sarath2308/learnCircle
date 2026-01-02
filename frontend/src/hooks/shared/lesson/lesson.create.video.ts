import { LessonApi } from "@/api/shared/lesson.api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

export const useLessonCreateWithVideo = () => {
  return useMutation({
    mutationKey: ["create-lesson-with-video"],
    mutationFn: ({ chapterId, payload }: { chapterId: string; payload: FormData }) =>
      LessonApi.CREATE_LESSON_WITH_VIDEO(chapterId, payload),
    onError: (err: unknown) => {
      if (err instanceof AxiosError) {
        toast.error(err?.response?.data?.message || "lesson Not Created");
      } else {
        toast.error("Something went wrong");
      }
    },
  });
};
