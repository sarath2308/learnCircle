import { EXCEPTION_API } from "@/api/profesional/exception.api";
import { useMutation } from "@tanstack/react-query";

export const useRemoveException = () => {
  return useMutation({
    mutationKey: ["remove-exception"],
    mutationFn: EXCEPTION_API.removeException,
  });
};
