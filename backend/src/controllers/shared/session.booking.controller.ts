import { HttpStatus } from "@/constants/shared/httpStatus";
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
  async createSession(req: IAuthRequest, res: Response): Promise<void> {
    const userId = req.user?.userId as string;
    req.body.learnerId = userId;
    const sessionBooking = await this._sessionBookingService.createSession(req.body);
    res.status(HttpStatus.CREATED).json({ success: true, data: sessionBooking });
  }

  async confirmBooking(req: IAuthRequest, res: Response): Promise<void> {
    const { bookingId } = req.params;
    await this._sessionBookingService.confirmBooking(bookingId);
    res.status(HttpStatus.OK).json({ success: true, message: "Booking confirmed successfully" });
  }
}
