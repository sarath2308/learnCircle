import { SESSION_API } from "@/api/learner/session.book.api"
import { useQuery } from "@tanstack/react-query"

export const useGetSessions = ()=>
{
    return useQuery({
        queryKey: ["sessions"],
        queryFn: SESSION_API.GET_SESSIONS,
    })
}