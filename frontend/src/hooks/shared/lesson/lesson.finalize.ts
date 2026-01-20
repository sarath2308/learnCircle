import { LessonApi } from "@/api/shared/lesson.api";
import type { ILessons } from "@/interface/lesson.response.interface";
import { addLesson } from "@/redux/slice/course/chapterSlice";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

interface FinalizeLessonResponse {
  success: boolean;
  lessonData: ILessons;
}

export const useLessonFinalize = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: async ({ lessonId }: { lessonId: string }) => {
      return LessonApi.FINALIZE_LESSON_VIDEO(lessonId);
    },
    onSuccess: (data: FinalizeLessonResponse) => {
      dispatch(addLesson({ chapterId: data.lessonData.chapterId, lesson: data.lessonData }));
    },
    onError: (err: unknown) => {
      if (err instanceof AxiosError) {
        toast.error(err?.response?.data?.message || "lesson Not Created");
      } else {
        toast.error("Something went wrong");
      }
    },
  });
};
