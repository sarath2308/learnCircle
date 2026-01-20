import { LessonApi } from "@/api/shared/lesson.api";
import type { ILessons } from "@/interface/lesson.response.interface";
import { addLesson } from "@/redux/slice/course/chapterSlice";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

interface CreateLessonResponse {
  success: boolean;
  lessonData: ILessons;
}
export const useLessonCreate = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationKey: ["create-lesson"],
    mutationFn: ({ chapterId, payload }: { chapterId: string; payload: FormData }) =>
      LessonApi.CREATE_LESSON(chapterId, payload),
    onSuccess(data: CreateLessonResponse) {
      console.log("MUTATION DATA →", data);
      console.log("lessonData →", data.lessonData);
      console.log("chapterId →", data.lessonData?.chapterId);
      dispatch(addLesson({ chapterId: data.lessonData.chapterId, lesson: data.lessonData }));
      toast.success("lesson created");
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
