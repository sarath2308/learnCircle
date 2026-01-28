import { CHAT_API } from "@/api/shared/chat.api"
import { useQuery } from "@tanstack/react-query"

export const useGetConversationOrCreate = (courseId: string)=>
{
    return useQuery({
        queryKey:["get-or-create-conversation"],
        queryFn:() => CHAT_API.getOrCreateConversation(courseId)
    })
}