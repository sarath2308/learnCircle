import { Router } from "express";
import { IAdminDashboardController } from "@/interface/admin/admin.dashboard.controller.interface";

export function adminDashboardRoutes(controller: IAdminDashboardController) {
  const router = Router();
  router.get("/", controller.getDashboard.bind(controller));
  return router;
}
