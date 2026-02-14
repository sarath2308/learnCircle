import { LEARNER_PROFESSIONALS_API } from "@/api/learner/learner.professionals.api";
import { useQuery } from "@tanstack/react-query";

export const useGetProfessionalProfile = (instructorId: string) => {
  return useQuery({
    queryKey: ["get-professional-profile", instructorId],
    queryFn: () => LEARNER_PROFESSIONALS_API.getProfessionalData(instructorId),
    enabled: !!instructorId,
  });
};
