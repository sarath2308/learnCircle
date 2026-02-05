import { IAuthRequest } from "@/interface/shared/auth/auth.request.interface";
import { ISessionBookingController } from "@/interface/shared/session-booking/booking/session.booking.controller";
import { ISessionBookingService } from "@/interface/shared/session-booking/booking/session.booking.service.interface";
import { TYPES } from "@/types/shared/inversify/types";
import { Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class SessionBookingController implements ISessionBookingController {
  constructor(
    @inject(TYPES.ISessionBookingService) private _sessionBookingService: ISessionBookingService,
  ) {}
  async bookSession(req: IAuthRequest, res: Response): Promise<void> {}
}
