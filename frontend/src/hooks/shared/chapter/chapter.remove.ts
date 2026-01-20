import { chapterApi } from "@/api/shared/chapterApi"
import { useMutation } from "@tanstack/react-query"

export const useRemoveChapter = ()=>
{
    return useMutation({
        mutationKey:["remove-chapter"],
        mutationFn: chapterApi.deleteChapter,
    })
}