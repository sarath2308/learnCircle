import { PROFESSIONAL_SESSION_API } from "@/api/profesional/professional.session.booking.api";
import { useQuery } from "@tanstack/react-query";

export const useGetSessionDataForInstructorDashboard = () => {
  return useQuery({
    queryKey: ["get-session-data-for-Dashboard"],
    queryFn: PROFESSIONAL_SESSION_API.GET_SESSION_DATA_FOR_DASHBOARD,
  });
};
