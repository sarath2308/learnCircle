import { HttpStatus } from "@/constants/shared/httpStatus";
import { Messages } from "@/constants/shared/messages";
import { AppError } from "@/errors/app.error";
import { ISlotGenerator } from "@/interface/shared/ISlotGenerator";
import { IMapper } from "@/interface/shared/mapper/mapper.interface";
import { IAvailabilityExceptionService } from "@/interface/shared/session-booking/availability-exception/availability.exception.service.interface";
import { IAvailabilityRepo } from "@/interface/shared/session-booking/availabillity/availability.repo.interface";
import { IAvailabilityService } from "@/interface/shared/session-booking/availabillity/availability.service.interface";
import { ISessionBookingService } from "@/interface/shared/session-booking/booking/session.booking.service.interface";
import { IAvailability } from "@/model/shared/availability.model";
import { CreateAvailabilitySchemaType } from "@/schema/shared/availability/availability.create.schema";
import { AvailabilityResponseType } from "@/schema/shared/availability/availability.response.schema";
import { UpdateAvailabilitySchemaType } from "@/schema/shared/availability/availability.update.schema";
import { Bookings } from "@/types/shared/bookings.response.type";
import { TYPES } from "@/types/shared/inversify/types";
import { inject, injectable } from "inversify";
import mongoose from "mongoose";

@injectable()
export class AvailabilityService implements IAvailabilityService {
  constructor(
    @inject(TYPES.IAvailabilityRepo) private _availabilityRepo: IAvailabilityRepo,
    @inject(TYPES.IAvailabilityMapper)
    private _availabilityMapper: IMapper<IAvailability, AvailabilityResponseType>,
    @inject(TYPES.IAvailabilityExceptionService)
    private _availabilityExceptionService: IAvailabilityExceptionService,
    @inject(TYPES.ISlotGenerator) private _slotGenerator: ISlotGenerator,
    @inject(TYPES.ISessionBookingService) private _sessionBookingService: ISessionBookingService,
  ) {}
  /**
   *
   * @param instructorId
   * @param data
   */
  async createAvailability(
    instructorId: string,
    data: CreateAvailabilitySchemaType,
  ): Promise<AvailabilityResponseType[]> {
    const instructorObjId = new mongoose.Types.ObjectId(instructorId);

    const { daysOfWeek, startTime, endTime, slotDuration, price } = data;

    // Create all documents
    await Promise.all(
      daysOfWeek.map((day) =>
        this._availabilityRepo.create({
          instructorId: instructorObjId,
          dayOfWeek: day,
          startTime,
          endTime,
          slotDuration,
          price,
        }),
      ),
    );

    const availabilityData =
      await this._availabilityRepo.getAllAvailabilityWithInstructorId(instructorId);

    if (availabilityData.length === 0) {
      return [];
    }

    return availabilityData.map((doc) => this._availabilityMapper.map(doc));
  }
  /**
   *
   * @param avlId = availability id
   * @param data
   */

  async updateAvailability(
    avlId: string,
    data: UpdateAvailabilitySchemaType,
  ): Promise<AvailabilityResponseType[]> {
    const availability = await this._availabilityRepo.findById(avlId);
    if (!availability) {
      throw new AppError(Messages.AVAILABILITY_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    availability.startTime = data.startTime ?? availability.startTime;
    availability.endTime = data.endTime ?? availability.endTime;
    availability.price = data.price ?? availability.price;
    availability.dayOfWeek = data.daysOfWeek ?? availability.dayOfWeek;
    availability.slotDuration = data.slotDuration ?? availability.slotDuration;

    await availability.save();

    const availabilityData = await this._availabilityRepo.getAllAvailabilityWithInstructorId(
      String(availability.instructorId),
    );

    if (availabilityData.length === 0) {
      return [];
    }

    return availabilityData.map((doc) => this._availabilityMapper.map(doc));
  }

  /**
   *
   * @param avlId
   */

  async removeAvailability(avlId: string): Promise<AvailabilityResponseType[]> {
    const availability = await this._availabilityRepo.findById(avlId);

    if (!availability) {
      throw new AppError(Messages.AVAILABILITY_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    await this._availabilityRepo.removeAvailability(avlId);
    const availabilityData = await this._availabilityRepo.getAllAvailabilityWithInstructorId(
      String(availability.instructorId),
    );

    if (availabilityData.length === 0) {
      return [];
    }

    return availabilityData.map((doc) => this._availabilityMapper.map(doc));
  }
  async getAllAvailabilityRules(instructorId: string): Promise<AvailabilityResponseType[]> {
    const availabilityData =
      await this._availabilityRepo.getAllAvailabilityWithInstructorId(instructorId);

    if (availabilityData.length === 0) {
      return [];
    }

    return availabilityData.map((doc) => this._availabilityMapper.map(doc));
  }

  async getAllAvailabilityOfInstructor(instructorId: string, date: Date): Promise<any> {
    const exception = await this._availabilityExceptionService.getExceptionForInstructorWithDate(
      instructorId,
      date,
    );
    if (exception) {
      throw new AppError(Messages.AVAILABILITY_EXCEPTION_FOUND, HttpStatus.NO_CONTENT);
    }
    const dayOfWeek = date.getDay(); // 0-6 (Sunday-Saturday)
    console.log(
      "🚀 ~ file: availability.service.ts:149 ~ AvailabilityService ~ getAllAvailabilityOfInstructor ~ dayOfWeek:",
      dayOfWeek,
    );
    const availabilityData = await this._availabilityRepo.getAvailabilityByInstructorAndDay(
      instructorId,
      dayOfWeek,
    );
    console.log(
      "🚀 ~ file: availability.service.ts:154 ~ AvailabilityService ~ getAllAvailabilityOfInstructor ~ availabilityData:",
      availabilityData,
    );
    if (!availabilityData) {
      throw new AppError(Messages.AVAILABILITY_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    const bookings = await this._sessionBookingService.getBookings(date, instructorId);
    const slots = this._slotGenerator.generateSlots(
      availabilityData.startTime,
      availabilityData.endTime,
      availabilityData.slotDuration,
    );
    const responseObj = slots.map((slot) => {
      let match = bookings.some((booking: Bookings) => {
        return slot.start === booking.startTime && slot.end === booking.endTime;
      });
      return { startTime: slot.start, endTime: slot.end, isAvailable: !match };
    });

    return { slots: responseObj, price: availabilityData.price };
  }
}
