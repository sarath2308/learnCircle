import { LEARNER_PROFESSIONALS_API } from "@/api/learner/learner.professionals.api"
import { useQuery } from "@tanstack/react-query"

export const useGetProfessionalsProfile = (search: string,page:number) =>
{
    return useQuery({
        queryKey:["get-professional-profile",search,page],
        queryFn:()=> LEARNER_PROFESSIONALS_API.getProfessionals(search,page),
    })
}