import { inject, injectable } from "inversify";
import { BaseRepo } from "./base";
import { ISessionBooking } from "@/model/shared/session.booking.model";
import { ISessionBookingRepo } from "@/interface/shared/session-booking/booking/session.booking.repo.interface";
import { TYPES } from "@/types/shared/inversify/types";
import { Model } from "mongoose";
import { BOOKING_STATUS } from "@/constants/shared/booking.status";

@injectable()
export class SessionBookingRepo extends BaseRepo<ISessionBooking> implements ISessionBookingRepo {
  constructor(@inject(TYPES.ISessionBooking) private _sessionBookingModel: Model<ISessionBooking>) {
    super(_sessionBookingModel);
  }
  async getBookingsOfInstructorWithDate(
    date: Date,
    instructorId: string,
  ): Promise<ISessionBooking[]> {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0); // 👈 LOCAL start of day

    const end = new Date(date);
    end.setHours(23, 59, 59, 999); // 👈 LOCAL end of day

    return await this._sessionBookingModel.find({
      instructorId,
      date: { $gte: start, $lte: end },
      status: { $in: [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.PENDING] },
    });
  }

  async checkSessionBookingExists(
    instructorId: string,
    date: Date,
    startTime: string,
    endTime: string,
  ): Promise<boolean> {
    const start = new Date(date);
    start.setUTCHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setUTCHours(23, 59, 59, 999);

    const existingBooking = await this._sessionBookingModel.findOne({
      instructorId: instructorId,
      date: { $gte: start, $lte: end },
      startTime: startTime,
      endTime: endTime,
    });
    return !!existingBooking;
  }

  async confirmSessionBooking(bookingId: string): Promise<void> {
    await this._sessionBookingModel.updateOne(
      { _id: bookingId },
      { $set: { status: BOOKING_STATUS.CONFIRMED }, $unset: { expiresAt: "" } },
    );
  }

  async cancelSessionBooking(bookingId: string): Promise<void> {
    await this._sessionBookingModel.updateOne(
      { _id: bookingId },
      { $set: { status: BOOKING_STATUS.CANCELLED }, $unset: { expiresAt: "" } },
    );
  }
}
