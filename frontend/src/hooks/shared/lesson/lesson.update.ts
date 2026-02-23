import { LessonApi } from "@/api/shared/lesson.api";
import { updateLesson } from "@/redux/slice/course/chapterSlice";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

export const useLessonUpdate = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationKey: ["update-lesson"],
    mutationFn: ({ lessonId, payload }: { lessonId: string; payload: FormData }) => {
      return LessonApi.UPDATE_LESSON(lessonId, payload);
    },
    onSuccess: (data) => {
      dispatch(
        updateLesson({
          chapterId: data.lessonData.chapterId,
          lessonId: data.lessonData.id,
          data: data.lessonData,
        }),
      );
    },
  });
};
