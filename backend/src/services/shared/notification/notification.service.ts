import { INotificationRepo } from "@/interface/shared/notification/notification.repo.interface";
import { INotificationService } from "@/interface/shared/notification/notification.service.interface";
import { ISocketEmitService } from "@/interface/shared/socket/socket.emit.interface";
import {
  NotificationResponseSchema,
  NotificationResponseType,
} from "@/schema/shared/notification/notification.response.schema";
import { TYPES } from "@/types/shared/inversify/types";
import { inject, injectable } from "inversify";
import mongoose from "mongoose";

@injectable()
export class NotificationService implements INotificationService {
  constructor(
    @inject(TYPES.INotificationRepo) private _notificationRepo: INotificationRepo,
    @inject(TYPES.ISocketEmitService) private _socketEMitService: ISocketEmitService,
  ) {}

  async notifyUser(userId: string, title: string, message: string): Promise<void> {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    await this._notificationRepo.create({ userId: userObjectId, title, message });
    await this._socketEMitService.emitToUser(`user:${userId}`, "notification", { title, message });
  }
  async getUserNotification(userId: string): Promise<NotificationResponseType[] | []> {
    const notification = await this._notificationRepo.getUserNotification(userId);

    const responseObject = notification.map((notif) => {
      return NotificationResponseSchema.parse({
        id: String(notif._id),
        title: notif.title,
        message: notif.message,
        isRead: notif.isRead,
      });
    });

    return responseObject;
  }
  async markEveryNotificationasRead(userId: string): Promise<void> {
    await this._notificationRepo.markAllTheNotificationAsRead(userId);
  }
}
