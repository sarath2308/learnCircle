import { PROFESSIONAL_SESSION_API } from "@/api/profesional/professional.session.booking.api"
import { useQuery } from "@tanstack/react-query"

export const useGetProfessionalSessions = () => {
    return useQuery({
        queryKey: ["professional-sessions"],
        queryFn:()=> PROFESSIONAL_SESSION_API.GET_ALL_BOOKINGS_FOR_INSTRUCTOR(),
    })
}