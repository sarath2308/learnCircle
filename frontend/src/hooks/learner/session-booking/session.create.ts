import { SESSION_API } from "@/api/learner/session.book.api";
import { useMutation } from "@tanstack/react-query";
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
  orderData: {
    amount: number;
    orderId: string;
    key: string;
  };
}
export const useCreateSession = () => {
  return useMutation({
    mutationKey: ["create-session"],
    mutationFn: SESSION_API.BOOK_SESSION,
  });
};
