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
}
