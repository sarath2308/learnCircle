import { IAvailability } from "@/model/shared/availability.model";
import { BaseRepo } from "./base";
import { IAvailabilityRepo } from "@/interface/shared/session-booking/availabillity/availability.repo.interface";
import { inject, injectable } from "inversify";
import { TYPES } from "@/types/shared/inversify/types";
import { Model } from "mongoose";

@injectable()
export class AvailabilityRepo extends BaseRepo<IAvailability> implements IAvailabilityRepo {
  constructor(@inject(TYPES.IAvailability) private _availabilityModel: Model<IAvailability>) {
    super(_availabilityModel);
  }

  async getAllAvailabilityWithInstructorId(instructorId: string): Promise<IAvailability[]> {
    return await this._availabilityModel.find({ instructorId, isActive: true });
  }

  async removeAvailability(avlId: string): Promise<void> {
    await this._availabilityModel.updateOne({ id: avlId }, { $set: { isActive: false } });
  }

  async findById(id: string): Promise<IAvailability | null> {
    return this._availabilityModel.findOne({ isActive: true, id });
  }
}
