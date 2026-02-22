import { HttpStatus } from "@/constants/shared/httpStatus";
import { IAuthRequest } from "@/interface/shared/auth/auth.request.interface";
import { INotificationController } from "@/interface/shared/notification/notification.controller.interface";
import { INotificationService } from "@/interface/shared/notification/notification.service.interface";
import { TYPES } from "@/types/shared/inversify/types";
import { Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class NotificationController implements INotificationController {
  constructor(
    @inject(TYPES.INotificationService) private _notificationService: INotificationService,
  ) {}

  async getUserNotification(req: IAuthRequest, res: Response): Promise<void> {
    const userId = req.user?.userId as string;
    const notificationData = await this._notificationService.getUserNotification(userId);
    res.status(HttpStatus.OK).json({ success: true, notificationData });
  }
  async markAllTheNotificationRead(req: IAuthRequest, res: Response): Promise<void> {
    const userId = req.user?.userId as string;
    await this._notificationService.markEveryNotificationasRead(userId);
    res.status(HttpStatus.OK).json({ success: true });
  }
}
