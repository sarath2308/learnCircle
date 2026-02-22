import { HttpStatus } from "@/constants/shared/httpStatus";
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
  async createException(req: IAuthRequest, res: Response): Promise<void> {
    const instructorId = req.user?.userId as string;
    const exceptionData = await this._availabilityExceptionService.createException(
      instructorId,
      req.body.date,
    );
    res.status(HttpStatus.CREATED).json({ success: true, exceptionData });
  }
  async removeException(req: IAuthRequest, res: Response): Promise<void> {
    const exceptionId = req.params.exceptionId as string;
    const exceptionData = await this._availabilityExceptionService.removeException(exceptionId);
    res.status(HttpStatus.OK).json({ success: true, exceptionData });
  }

  async listException(req: IAuthRequest, res: Response): Promise<void> {
    const instructorId = req.user?.userId as string;
    const exceptionData = await this._availabilityExceptionService.listException(instructorId);
    res.status(HttpStatus.OK).json({ success: true, exceptionData });
  }
}
