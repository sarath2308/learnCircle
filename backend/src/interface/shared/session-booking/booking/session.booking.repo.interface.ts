import { ISessionBooking } from "@/model/shared/session.booking.model";
import { IBaseRepo } from "@/repos/shared/base";

export interface ISessionBookingRepo extends IBaseRepo<ISessionBooking> {
  getBookingsOfInstructorWithDate: (
    date: Date,
    instructorId: string,
  ) => Promise<ISessionBooking[] | null>;
}
