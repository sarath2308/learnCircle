import { HttpStatus } from "@/constants/shared/httpStatus";
import { IAuthRequest } from "@/interface/shared/auth/auth.request.interface";
import { IAvailabilityController } from "@/interface/shared/session-booking/availabillity/availability.controller.interface";
import { IAvailabilityService } from "@/interface/shared/session-booking/availabillity/availability.service.interface";
import { TYPES } from "@/types/shared/inversify/types";
import { Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class AvailabilityController implements IAvailabilityController {
  constructor(
    @inject(TYPES.IAvailabilityService) private _availabilityService: IAvailabilityService,
  ) {}
  async createAvailability(req: IAuthRequest, res: Response): Promise<void> {
    const instructorId = req.user?.userId as string;
    const availabilityData = await this._availabilityService.createAvailability(
      instructorId,
      req.body,
    );
    res.status(HttpStatus.CREATED).json({ success: true, availabilityData });
  }
  async updateAvailability(req: IAuthRequest, res: Response): Promise<void> {
    const availabilityId = req.params.availabilityId as string;
    const availabilityData = await this._availabilityService.updateAvailability(
      availabilityId,
      req.body,
    );
    res.status(HttpStatus.OK).json({ success: true, availabilityData });
  }
  async removeAvailability(req: IAuthRequest, res: Response): Promise<void> {
    const availabilityId = req.params.availabilityId as string;
    const availabilityData = await this._availabilityService.removeAvailability(availabilityId);
    res.status(HttpStatus.OK).json({ success: true, availabilityData });
  }
  async getAllAvailabilityOfInstructor(req: IAuthRequest, res: Response): Promise<void> {
    const instructorId = req.user?.userId as string;
    const availabilityData =
      await this._availabilityService.getAllAvailabilityOfInstructor(instructorId);
    res.status(HttpStatus.OK).json({ success: true, availabilityData });
  }
}
