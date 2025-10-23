import { learnerHomeApi } from "@/api/learner/learnerHomeApi"
import { useQuery } from "@tanstack/react-query"

export const useGetHome = ()=>
{
 const getHome = useQuery({
    queryKey:["getHome"],
    queryFn:learnerHomeApi.getHome,
 })
 return getHome;
}