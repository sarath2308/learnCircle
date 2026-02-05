import { HttpStatus } from "@/constants/shared/httpStatus";
import { Messages } from "@/constants/shared/messages";
import { AppError } from "@/errors/app.error";
import { IMapper } from "@/interface/shared/mapper/mapper.interface";
import { IAvailabilityRepo } from "@/interface/shared/session-booking/availabillity/availability.repo.interface";
import { IAvailabilityService } from "@/interface/shared/session-booking/availabillity/availability.service.interface";
import { IAvailability } from "@/model/shared/availability.model";
import { CreateAvailabilitySchemaType } from "@/schema/shared/availability/availability.create.schema";
import { AvailabilityResponseType } from "@/schema/shared/availability/availability.response.schema";
import { UpdateAvailabilitySchemaType } from "@/schema/shared/availability/availability.update.schema";
import { TYPES } from "@/types/shared/inversify/types";
import { inject, injectable } from "inversify";
import mongoose from "mongoose";

@injectable()
export class AvailabilityService implements IAvailabilityService {
  constructor(
    @inject(TYPES.IAvailabilityRepo) private _availabilityRepo: IAvailabilityRepo,
    @inject(TYPES.IAvailabilityMapper)
    private _availabilityMapper: IMapper<IAvailability, AvailabilityResponseType>,
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
  async getAllAvailabilityOfInstructor(instructorId: string): Promise<AvailabilityResponseType[]> {
    const availabilityData =
      await this._availabilityRepo.getAllAvailabilityWithInstructorId(instructorId);

    if (availabilityData.length === 0) {
      return [];
    }

    return availabilityData.map((doc) => this._availabilityMapper.map(doc));
  }
}
