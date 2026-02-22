import { EXCEPTION_API } from "@/api/profesional/exception.api";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useCreateException = () => {
  return useMutation({
    mutationKey: ["create-exception"],
    mutationFn: EXCEPTION_API.createException,
    onSuccess: () => {
      toast.success("Successfully blocked date");
    },
  });
};
