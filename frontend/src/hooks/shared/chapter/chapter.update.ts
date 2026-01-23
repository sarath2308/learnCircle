import { chapterApi } from "@/api/shared/chapterApi"
import {  updateChapter } from "@/redux/slice/course/chapterSlice";
import { useMutation } from "@tanstack/react-query"
import { useDispatch } from "react-redux"

 interface ChapterData {
  id: string;
  title: string;
  description: string;
  order: number;
}

interface IChapterResponse
{
    success: boolean;
    chapterData: ChapterData
}

export const useChapterUpdate = () =>
{
    const dispatch = useDispatch();
    return useMutation({
        mutationKey:["update-chapter"],
        mutationFn:({chapterId,title,description}:{chapterId: string,title: string, description: string}) =>chapterApi.updateChapter(chapterId,{title,description}),
        onSuccess:(data: IChapterResponse)=>
        {
           dispatch(updateChapter({id:data.chapterData.id, data:data.chapterData}))
        }
    })
}