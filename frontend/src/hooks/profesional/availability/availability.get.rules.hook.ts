import { AVAILABILITY_API } from "@/api/profesional/availability.api"
import { useQuery } from "@tanstack/react-query"

export const useGetAvailabilityRecords = () =>
{
    return useQuery({
        queryKey:["get-availability-records"],
        queryFn: AVAILABILITY_API.getAllAvailabilityRule,
    })
}