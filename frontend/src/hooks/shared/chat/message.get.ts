import { CHAT_API } from "@/api/shared/chat.api"
import { useQuery } from "@tanstack/react-query"

export const useGetMessages = (conversationId: string)=>
{
    return useQuery({
        queryKey:["get-messages"],
        queryFn:()=> CHAT_API.getMessages(conversationId),
        enabled: !!conversationId
    })
}