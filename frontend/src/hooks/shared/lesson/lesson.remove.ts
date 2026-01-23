import { LessonApi } from "@/api/shared/lesson.api"
import { deleteLesson } from "@/redux/slice/course/chapterSlice";
import { useMutation } from "@tanstack/react-query"
import { useDispatch } from "react-redux"

export const useRemoveLesson = ()=>
{
    const dispatch = useDispatch();
    return useMutation({
        mutationKey:["remove-lesson"],
        mutationFn: LessonApi.DELETE_LESSON,
        onSuccess:(data) => {
              dispatch(deleteLesson({chapterId: data.chapterId, lessonId: data.lessonId}))
        }
    })
}