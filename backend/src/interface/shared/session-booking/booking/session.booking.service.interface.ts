import { SessionBookingRequestType } from "@/schema/learner/session.booking/session.booking.request.schema";
import { SessionBookingResponseType } from "@/schema/learner/session.booking/session.booking.response.schema";
import { MonthlySessionData } from "@/types/professional/monthely.session.data.type";

export interface ISessionBookingService {
  createSession: (data: SessionBookingRequestType) => Promise<{
    session: SessionBookingResponseType;
    order: { key: string; amount: number; orderId: string };
  }>;
  cancelBooking?: (sessionBookingId: string) => Promise<void>;
  confirmBooking: (sessionBookingId: string) => Promise<SessionBookingResponseType>;
  getAllBookingForUser: (
    userId: string,
  ) => Promise<{ upcoming: SessionBookingResponseType[]; completed: SessionBookingResponseType[] }>;
  getAllBoookingForInstructor: (
    instructorId: string,
  ) => Promise<{ upcoming: SessionBookingResponseType[]; completed: SessionBookingResponseType[] }>;
  getBookings: (date: Date, instructorId: string) => Promise<SessionBookingResponseType[]>;
  checkJoinPermission: (
    sessionBookingId: string,
    userId: string,
  ) => Promise<{ hasPermission: boolean; roomId: string }>;

  MarkSessionAsCompleted: (sessionBookingId: string) => Promise<void>;

  getSessionDataForProfessionalDashboard: (instructorId: string) => Promise<{
    totalSession: number;
    sessionEarning: number;
    sessionMonthData: MonthlySessionData[];
  }>;
  getTotalCompletedSessionForAdmin: () => Promise<number>;
}
