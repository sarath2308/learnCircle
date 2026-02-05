import { IAvailabilityExceptionRepo } from "@/interface/shared/session-booking/availability-exception/availability.exception.repo.interface";
import { IAvailabilityExceptionService } from "@/interface/shared/session-booking/availability-exception/availability.exception.service.interface";
import { TYPES } from "@/types/shared/inversify/types";
import { inject, injectable } from "inversify";

@injectable()
export class AvailabilityExceptionService implements IAvailabilityExceptionService {
  constructor(
    @inject(TYPES.IAvailabilityExceptionRepo)
    private _availabilityExceptionRepo: IAvailabilityExceptionRepo,
  ) {}
  async createException(instructorId: string, availabilityId: string, data: any): Promise<any> {}
  async removeException(exceptionId: string): Promise<any> {}
}
