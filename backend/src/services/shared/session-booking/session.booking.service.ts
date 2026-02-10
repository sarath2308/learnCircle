import { HttpStatus } from "@/constants/shared/httpStatus";
import { Messages } from "@/constants/shared/messages";
import { AppError } from "@/errors/app.error";
import { IMapper } from "@/interface/shared/mapper/mapper.interface";
import { IAvailabilityRepo } from "@/interface/shared/session-booking/availabillity/availability.repo.interface";
import { ISessionBookingRepo } from "@/interface/shared/session-booking/booking/session.booking.repo.interface";
import { ISessionBookingService } from "@/interface/shared/session-booking/booking/session.booking.service.interface";
import { ISessionBooking } from "@/model/shared/session.booking.model";
import { SessionBookingRequestType } from "@/schema/learner/session.booking/session.booking.request.schema";
import { SessionBookingResponseType } from "@/schema/learner/session.booking/session.booking.response.schema";
import { TYPES } from "@/types/shared/inversify/types";
import { inject, injectable } from "inversify";
import mongoose from "mongoose";

@injectable()
export class SessionBookingService implements ISessionBookingService {
  constructor(
    @inject(TYPES.ISessionBookingRepo) private _sessionBookingRepo: ISessionBookingRepo,
    @inject(TYPES.ISessionBookingMapper)
    private _sessionBookingMapper: IMapper<ISessionBooking, SessionBookingResponseType>,
    @inject(TYPES.IAvailabilityRepo) private _avilabilityRepo: IAvailabilityRepo,
  ) {}
  /**
   *
   * @param data
   */
  async createSession(data: SessionBookingRequestType): Promise<SessionBookingResponseType> {
    const isBookingExists = await this._sessionBookingRepo.checkSessionBookingExists(
      data.instructorId,
      new Date(data.date),
      data.startTime,
      data.endTime,
    );

    if (isBookingExists) {
      throw new AppError(Messages.SLOT_NOT_AVAILABLE, HttpStatus.BAD_REQUEST);
    }
    const dayOfWeek = new Date(data.date).getDay();
    const availability = await this._avilabilityRepo.getAvailabilityByInstructorAndDay(
      data.instructorId,
      dayOfWeek,
    );

    if (!availability) {
      throw new AppError(Messages.SLOT_NOT_AVAILABLE, HttpStatus.BAD_REQUEST);
    }

    const instructorObjectId = new mongoose.Types.ObjectId(data.instructorId);
    const learnerObjectId = new mongoose.Types.ObjectId(data.learnerId);
    const date = new Date(data.date);

    const sessionBooking = await this._sessionBookingRepo.create({
      instructorId: instructorObjectId,
      learnerId: learnerObjectId,
      date: date,
      price: availability.price,
      typeOfSession: data.typeOfSession,
      startTime: data.startTime,
      endTime: data.endTime,
    });

    if (!sessionBooking) {
      throw new AppError(Messages.SESSION_BOOKING_NOT_CREATED, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return this._sessionBookingMapper.map(sessionBooking);
  }

  /**
   *
   * @param date
   * @param instructorId
   * @returns
   */

  async getBookings(date: Date, instructorId: string): Promise<SessionBookingResponseType[]> {
    console.log("date from get Bookings line  76", date, instructorId);
    const bookingsData = await this._sessionBookingRepo.getBookingsOfInstructorWithDate(
      date,
      instructorId,
    );
    if (bookingsData?.length === 0) {
      return [];
    }
    return (bookingsData ?? []).map((booking) => this._sessionBookingMapper.map(booking));
  }

  /**
   *
   * @param sessionBookingId
   * @returns
   */

  async confirmBooking(sessionBookingId: string): Promise<SessionBookingResponseType> {
    const booking = await this._sessionBookingRepo.findById(sessionBookingId);
    if (!booking) {
      throw new AppError(Messages.SESSION_BOOKING_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    await this._sessionBookingRepo.confirmSessionBooking(sessionBookingId);
    return this._sessionBookingMapper.map(booking);
  }

  async cancelBooking(sessionBookingId: string): Promise<void> {
    const booking = await this._sessionBookingRepo.findById(sessionBookingId);
    if (!booking) {
      throw new AppError(Messages.SESSION_BOOKING_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    await this._sessionBookingRepo.cancelSessionBooking(sessionBookingId);
  }
  async getAllBookingForUser(userId: string): Promise<any> {}
  async getAllBoookingForInstructor(instructorId: string): Promise<SessionBookingResponseType[]> {
    // return await this._sessionBookingRepo.getAllBookingsForInstructor(instructorId);
  }
}
