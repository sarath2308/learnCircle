import { inject, injectable } from "inversify";
import { BaseRepo } from "./base";
import { ISessionBooking } from "@/model/shared/session.booking.model";
import { ISessionBookingRepo } from "@/interface/shared/session-booking/booking/session.booking.repo.interface";
import { TYPES } from "@/types/shared/inversify/types";
import mongoose, { Model } from "mongoose";
import { BOOKING_STATUS } from "@/constants/shared/booking.status";
import { MonthlySessionData } from "@/types/professional/monthely.session.data.type";

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
  async getAllUpcomingBookingsForUser(userId: string): Promise<ISessionBooking[]> {
    return await this._sessionBookingModel
      .find({
        learnerId: userId,
        status: BOOKING_STATUS.CONFIRMED,
      })
      .sort({ date: 1, startTime: 1 });
  }

  async getAllCompletedBookingsForUser(userId: string): Promise<ISessionBooking[]> {
    return await this._sessionBookingModel.find({
      learnerId: userId,
      status: BOOKING_STATUS.COMPLETED,
    });
  }
  async getAllUpcomingBookingsForInstructor(instructorId: string): Promise<ISessionBooking[]> {
    return await this._sessionBookingModel
      .find({
        instructorId: instructorId,
        status: BOOKING_STATUS.CONFIRMED,
      })
      .sort({ date: 1, startTime: 1 });
  }
  async getAllCompletedBookingsForInstructor(instructorId: string): Promise<ISessionBooking[]> {
    return await this._sessionBookingModel.find({
      instructorId: instructorId,
      status: BOOKING_STATUS.COMPLETED,
    });
  }
  async updateSessionStatusToCompleted(bookingId: string): Promise<void> {
    await this._sessionBookingModel.updateOne(
      { _id: bookingId },
      { $set: { status: BOOKING_STATUS.COMPLETED } },
    );
  }

  async totalCompletedSessionOfInstructor(instructorId: string): Promise<number> {
    const instructorObjId = new mongoose.Types.ObjectId(instructorId);
    return await this._sessionBookingModel.countDocuments({
      instructorId: instructorObjId,
      status: BOOKING_STATUS.COMPLETED,
    });
  }
  async totalEarningsForInstructor(instructorId: string): Promise<{ totalEarning: number }> {
    const instructorObjId = new mongoose.Types.ObjectId(instructorId);
    const result = await this._sessionBookingModel.aggregate([
      {
        $match: { instructorId: instructorObjId, status: BOOKING_STATUS.COMPLETED },
      },
      {
        $group: { _id: "$instructorId", totalEarning: { $sum: "$price" } },
      },
    ]);

    return result[0] || { totalEarning: 0 };
  }
  async monthlySessionDataOfInstructor(instructorId: string): Promise<MonthlySessionData[]> {
    const result = await this._sessionBookingModel.aggregate([
      {
        $match: {
          instructorId: new mongoose.Types.ObjectId(instructorId),
          status: BOOKING_STATUS.COMPLETED,
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalRevenue: { $sum: "$price" },
          totalSessions: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          totalRevenue: 1,
          totalSessions: 1,
        },
      },
    ]);

    return result;
  }
  async getTotalCompletedSessionCount(): Promise<number> {
    return await this._sessionBookingModel.countDocuments({ status: BOOKING_STATUS.COMPLETED });
  }
}
