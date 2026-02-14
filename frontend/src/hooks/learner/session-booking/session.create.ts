import { SESSION_API } from "@/api/learner/session.book.api";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useCompleteSession } from "./learner.session.complete.hook";
import type { BookingStatus } from "@/pages/Learner/learner.profile.myBookings";

export interface SessionBooking {
  id: string; // 24-char Mongo ObjectId string
  instructorId: string; // 24-char Mongo ObjectId string
  date: string; // ISO date string or YYYY-MM-DD (since you're using z.coerce.string())
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  price: number; // must be positive
  typeOfSession: string;
  status: BookingStatus;
}

export interface CreateSessionPayload {
  success: boolean;
  data: SessionBooking;
}
export const useCreateSession = () => {
  const sessionComleteMutation = useCompleteSession();
  return useMutation({
    mutationKey: ["create-session"],
    mutationFn: SESSION_API.BOOK_SESSION,
    onSuccess: async (res: CreateSessionPayload) => {
      await sessionComleteMutation.mutateAsync(res.data.id);
      toast.success("Session Created Successfully");
    },
  });
};
