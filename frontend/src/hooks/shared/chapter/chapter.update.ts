import { chapterApi } from "@/api/shared/chapterApi"
import { useMutation } from "@tanstack/react-query"

export const useChapterUpdate = () =>
{
    return useMutation({
        mutationKey:["update-chapter"],
        mutationFn:({chapterId,title,description}:{chapterId: string,title: string, description: string}) =>chapterApi.updateChapter(chapterId,{title,description})
    })
}