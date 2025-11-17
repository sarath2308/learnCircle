import { Router } from "express";
import { IAdminUserManagementController } from "@/interface/admin/IAdminUserManagementController";

export function userManagementRoutes(controller: IAdminUserManagementController) {
  const router = Router();

  router.patch("/block-user", controller.blockUser.bind(controller));
  router.patch("/unblock-user", controller.unblockUser.bind(controller));
  router.patch("/approve-professional", controller.approveUser.bind(controller));
  router.patch("/reject-professional", controller.rejectUser.bind(controller));
  router.get("/learner", controller.getLearnerData.bind(controller));
  router.get("/professional", controller.getProfessionalData.bind(controller));

  return router;
}
