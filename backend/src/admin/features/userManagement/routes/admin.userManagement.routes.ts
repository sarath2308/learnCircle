import { Router } from "express";
import { IAdminUserManagementController } from "../interfaces/IAdminUserManagementController";

export function userManagementRoutes(controller: IAdminUserManagementController) {
  const router = Router();

  router.get("/", controller.getUserManagement.bind(controller));
  router.patch("/block-user", controller.blockUser.bind(controller));
  router.patch("/unblock-user", controller.unblockUser.bind(controller));
  router.patch("/approve-professional", controller.approveUser.bind(controller));
  router.patch("/reject-professional", controller.rejectUser.bind(controller));

  return router;
}
