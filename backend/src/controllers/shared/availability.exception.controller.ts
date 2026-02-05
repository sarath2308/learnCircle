import { IAuthRequest } from "@/interface/shared/auth/auth.request.interface";
import { IAvailabilityExceptionController } from "@/interface/shared/session-booking/availability-exception/availability.exception.controller";
import { IAvailabilityExceptionService } from "@/interface/shared/session-booking/availability-exception/availability.exception.service.interface";
import { TYPES } from "@/types/shared/inversify/types";
import { Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class AvailabilityExceptionController implements IAvailabilityExceptionController {
  constructor(
    @inject(TYPES.IAvailabilityExceptionService)
    private _availabilityExceptionService: IAvailabilityExceptionService,
  ) {}
  async createException(req: IAuthRequest, res: Response): Promise<void> {}
  async removeException(req: IAuthRequest, res: Response): Promise<void> {}
}
