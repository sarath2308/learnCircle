import { SessionBookingRequestType } from "@/schema/learner/session.booking/session.booking.request.schema";
import { SessionBookingResponseType } from "@/schema/learner/session.booking/session.booking.response.schema";

export interface ISessionBookingService {
  createSession: (data: SessionBookingRequestType) => Promise<SessionBookingResponseType>;
  cancelBooking?: (sessionBookingId: string) => Promise<void>;
  confirmBooking: (sessionBookingId: string) => Promise<SessionBookingResponseType>;
  getAllBookingForUser?: (userId: string) => Promise<SessionBookingResponseType[]>;
  getAllBoookingForInstructor?: (instructorId: string) => Promise<SessionBookingResponseType[]>;
  getBookings: (date: Date, instructorId: string) => Promise<SessionBookingResponseType[]>;
}
