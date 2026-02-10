import { ISessionBooking } from "@/model/shared/session.booking.model";
import { IBaseRepo } from "@/repos/shared/base";

export interface ISessionBookingRepo extends IBaseRepo<ISessionBooking> {
  getBookingsOfInstructorWithDate: (
    date: Date,
    instructorId: string,
  ) => Promise<ISessionBooking[] | null>;

  checkSessionBookingExists: (
    instructorId: string,
    date: Date,
    startTime: string,
    endTime: string,
  ) => Promise<boolean>;

  confirmSessionBooking: (bookingId: string) => Promise<void>;

  cancelSessionBooking: (bookingId: string) => Promise<void>;
}
