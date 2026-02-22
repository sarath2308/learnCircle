import { useMutation } from "@tanstack/react-query";
import { SESSION_API } from "@/api/learner/session.book.api";
import toast from "react-hot-toast";

export const useCompleteSession = () => {
  return useMutation({
    mutationKey: ["confirm-session"],
    mutationFn: SESSION_API.CONFIRM_SESSION,
    onSuccess: () => {
      toast.success("Session marked as confirmed successfully");
    },
  });
};
