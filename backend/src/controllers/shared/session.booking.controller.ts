import { HttpStatus } from "@/constants/shared/httpStatus";
import { Messages } from "@/constants/shared/messages";
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
    res
      .status(HttpStatus.CREATED)
      .json({ success: true, data: sessionBooking, orderData: sessionBooking.order });
  }

  async confirmBooking(req: IAuthRequest, res: Response): Promise<void> {
    const { bookingId } = req.params;
    const bookingData = await this._sessionBookingService.confirmBooking(bookingId);
    res.status(HttpStatus.OK).json({ success: true, bookingData });
  }
  async getAllBookingForUser(req: IAuthRequest, res: Response): Promise<void> {
    const userId = req.user?.userId as string;
    const bookings = await this._sessionBookingService.getAllBookingForUser(userId);
    res.status(HttpStatus.OK).json({ success: true, data: bookings });
  }

  async getAllBoookingForInstructor(req: IAuthRequest, res: Response): Promise<void> {
    const instructorId = req.user?.userId as string;
    const bookings = await this._sessionBookingService.getAllBoookingForInstructor(instructorId);
    res.status(HttpStatus.OK).json({ success: true, data: bookings });
  }
  async checkJoinPermission(req: IAuthRequest, res: Response): Promise<void> {
    const userId = req.user?.userId as string;
    const { bookingId } = req.params;
    const permissionData = await this._sessionBookingService.checkJoinPermission(bookingId, userId);
    res.status(HttpStatus.OK).json({ success: true, data: permissionData });
  }

  async markSessionAsCompleted(req: IAuthRequest, res: Response): Promise<void> {
    const { sessionId } = req.params;
    await this._sessionBookingService.MarkSessionAsCompleted(sessionId);
    res.status(HttpStatus.OK).json({ success: true, message: Messages.SESSION_MARKED_COMPLETED });
  }

  async getSessionDataForProfessionalDashboard(req: IAuthRequest, res: Response): Promise<void> {
    const userId = req.user?.userId as string;
    const result = await this._sessionBookingService.getSessionDataForProfessionalDashboard(userId);
    res.status(HttpStatus.OK).json({
      success: true,
      totalSession: result.totalSession,
      sessionEarning: result.sessionEarning,
      sessionMonthData: result.sessionMonthData,
    });
  }
}
