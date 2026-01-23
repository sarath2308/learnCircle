import { chapterApi } from "@/api/shared/chapterApi"
import { deleteChapter } from "@/redux/slice/course/chapterSlice";
import { useMutation } from "@tanstack/react-query"
import { useDispatch } from "react-redux"

export const useRemoveChapter = ()=>
{
    const dispatch = useDispatch();
    return useMutation({
        mutationKey:["remove-chapter"],
        mutationFn: chapterApi.deleteChapter,
        onSuccess:(data)=>{
            dispatch(deleteChapter(data.chapterId))
        }
    })
}