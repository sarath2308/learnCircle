import { HttpStatus } from "@/constants/shared/httpStatus";
import { Messages } from "@/constants/shared/messages";
import { AppError } from "@/errors/app.error";
import { IAvailabilityExceptionRepo } from "@/interface/shared/session-booking/availability-exception/availability.exception.repo.interface";
import { IAvailabilityExceptionService } from "@/interface/shared/session-booking/availability-exception/availability.exception.service.interface";
import {
  AvailabilityExceptionResponseSchema,
  AvailabilityExceptionResponseType,
} from "@/schema/shared/availability/exception/exceptionResponse.schem";
import { TYPES } from "@/types/shared/inversify/types";
import { inject, injectable } from "inversify";
import mongoose from "mongoose";

@injectable()
export class AvailabilityExceptionService implements IAvailabilityExceptionService {
  constructor(
    @inject(TYPES.IAvailabilityExceptionRepo)
    private _availabilityExceptionRepo: IAvailabilityExceptionRepo,
  ) {}
  async createException(
    instructorId: string,
    date: Date,
  ): Promise<AvailabilityExceptionResponseType> {
    const instructorObjId = new mongoose.Types.ObjectId(instructorId);
    const ExceptionData = await this._availabilityExceptionRepo.create({
      instructorId: instructorObjId,
      date,
    });
    return AvailabilityExceptionResponseSchema.parse({
      id: String(ExceptionData._id),
      date: ExceptionData.date.toISOString(),
    });
  }
  async removeException(exceptionId: string): Promise<AvailabilityExceptionResponseType> {
    const Exception = await this._availabilityExceptionRepo.findById(exceptionId);
    if (!Exception) {
      throw new AppError(Messages.AVAILABILITY_EXCEPTION_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    await this._availabilityExceptionRepo.removeException(exceptionId);
    return AvailabilityExceptionResponseSchema.parse({
      id: String(Exception._id),
      date: Exception.date.toISOString(),
    });
  }
  async listException(instructorId: string): Promise<AvailabilityExceptionResponseType[]> {
    const ExceptionData =
      await this._availabilityExceptionRepo.listExceptionOfInstructor(instructorId);
    return ExceptionData.map((val) => {
      return AvailabilityExceptionResponseSchema.parse({
        id: String(val._id),
        date: val.date.toISOString(),
      });
    });
  }
  async getExceptionForInstructorWithDate(
    instructorId: string,
    date: Date,
  ): Promise<AvailabilityExceptionResponseType | null> {
    const exception = await this._availabilityExceptionRepo.getExceptionWithDateAndInstructorId(
      date,
      instructorId,
    );

    if (!exception) {
      return null;
    }
    return AvailabilityExceptionResponseSchema.parse({
      id: String(exception._id),
      date: exception.date.toISOString(),
    });
  }
}
