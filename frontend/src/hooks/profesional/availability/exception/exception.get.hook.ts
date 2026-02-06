import { EXCEPTION_API } from "@/api/profesional/exception.api"
import { useQuery } from "@tanstack/react-query"

export interface IGetException
{
        id: string;
        date: string
}
export const useGetException = () =>
{
    return useQuery({
        queryKey:["get-exception"],
        queryFn:EXCEPTION_API.listException,

    })
}