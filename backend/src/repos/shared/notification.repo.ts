import { INotificationRepo } from "@/interface/shared/notification/notification.repo.interface";
import { BaseRepo } from "./base";
import { INotification } from "@/model/shared/notification.model";
import { inject, injectable } from "inversify";
import { TYPES } from "@/types/shared/inversify/types";
import { Model } from "mongoose";

@injectable()
export class NotificationRepo extends BaseRepo<INotification> implements INotificationRepo {
  constructor(@inject(TYPES.INotificationModel) private _notificationModel: Model<INotification>) {
    super(_notificationModel);
  }

  async getUserNotification(userId: string): Promise<INotification[] | []> {
    return await this._notificationModel.find({ userId: userId, isRead: false });
  }

  async markAllTheNotificationAsRead(userId: string): Promise<void> {
    await this._notificationModel.updateMany({ userId: userId }, { $set: { isRead: true } });
  }
}
