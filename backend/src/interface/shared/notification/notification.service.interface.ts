import { NotificationResponseType } from "@/schema/shared/notification/notification.response.schema";

export interface INotificationService {
  notifyUser: (userId: string, title: string, message: string) => Promise<void>;
  getUserNotification: (userId: string) => Promise<NotificationResponseType[] | []>;
  markEveryNotificationasRead: (userId: string) => Promise<void>;
}
