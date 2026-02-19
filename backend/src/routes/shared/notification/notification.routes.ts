import { INotificationController } from "@/interface/shared/notification/notification.controller.interface";
import { Router } from "express";

export const NotificationRoutes = (controller: INotificationController) => {
  const router = Router();
  router.get("/", controller.getUserNotification.bind(controller));
  router.post("/", controller.markAllTheNotificationRead.bind(controller));

  return router;
};
