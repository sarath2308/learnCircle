import { PROFESSIONA_PROFILE_API } from "@/api/profesional/professional.profile.api";
import { useQuery } from "@tanstack/react-query";

export const useGetProfessionalProfile = () => {
  return useQuery({
    queryKey: ["get-professional-profile"],
    queryFn: PROFESSIONA_PROFILE_API.GET_PROFILE,
  });
};
