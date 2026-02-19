import { INotification } from "@/model/shared/notification.model";
import { IBaseRepo } from "@/repos/shared/base";

export interface INotificationRepo extends IBaseRepo<INotification> {
  getUserNotification: (userId: string) => Promise<INotification[] | []>;
  markAllTheNotificationAsRead: (userId: string) => Promise<void>;
}
