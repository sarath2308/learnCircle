import { ENROLLMENT_API } from "@/api/shared/enrollment.api";
import { useMutation } from "@tanstack/react-query";

export const useEnrollUser = () => {
  return useMutation({
    mutationFn: ENROLLMENT_API.ENROLL_USER,
  });
};
