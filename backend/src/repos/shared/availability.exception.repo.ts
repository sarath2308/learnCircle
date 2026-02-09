import { BaseRepo } from "./base";
import { IAvailabilityException } from "@/model/shared/availability.exception.model";
import { IAvailabilityExceptionRepo } from "@/interface/shared/session-booking/availability-exception/availability.exception.repo.interface";
import { inject, injectable } from "inversify";
import { TYPES } from "@/types/shared/inversify/types";
import { Model } from "mongoose";

@injectable()
export class AvailabilityExceptionRepo
  extends BaseRepo<IAvailabilityException>
  implements IAvailabilityExceptionRepo
{
  constructor(
    @inject(TYPES.IAvailabilityException)
    private _availabilityExceptionModel: Model<IAvailabilityException>,
  ) {
    super(_availabilityExceptionModel);
  }

  async removeException(exId: string): Promise<void> {
    await this._availabilityExceptionModel.updateOne({ _id: exId }, { $set: { isActive: false } });
  }
  async listExceptionOfInstructor(instructorId: string): Promise<IAvailabilityException[]> {
    return await this._availabilityExceptionModel.find({ instructorId, isActive: true });
  }
  async getExceptionWithDateAndInstructorId(
    date: Date,
    instructorId: string,
  ): Promise<IAvailabilityException | null> {
    const start = new Date(date);
    start.setUTCHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setUTCHours(23, 59, 59, 999);

    return await this._availabilityExceptionModel.findOne({
      instructorId,
      isActive: true,
      date: { $gte: start, $lte: end },
    });
  }
}
