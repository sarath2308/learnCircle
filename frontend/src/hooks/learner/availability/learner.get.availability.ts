import { LEARNER_AVAILABILITY_API } from "@/api/learner/availability.api";
import { useQuery } from "@tanstack/react-query";

export const useGetAvailability = (instructorId: string, date: string) => {
  return useQuery({
    queryKey: ["get-availability", instructorId, date],
    queryFn: () => LEARNER_AVAILABILITY_API.GET_AVAILABILITY(instructorId, date),
    enabled: !!instructorId && !!date,

    staleTime: 0,        // always stale
    gcTime: 0,           // immediately garbage collect (v5)  // use cacheTime in v4
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
