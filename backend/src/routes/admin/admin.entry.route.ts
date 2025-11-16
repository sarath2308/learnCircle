import { Router } from "express";
import { TYPES } from "../../types/shared/inversify/types";
import container from "@/config/inversify/inversify.config";
import { IAdminDashboardController } from "@/interface/admin/IAdminDashboardController";
import { IAdminUserManagementController } from "@/interface/admin/IAdminUserManagementController";
import { adminDashboardRoutes } from "./admin.dashboard.routes";
import { userManagementRoutes } from "./admin.userManagement.routes";
export function adminEntryRoute() {
  const router = Router();
  const dashboardController = container.get<IAdminDashboardController>(
    TYPES.IAdminDashboardController,
  );
  const userManagementController = container.get<IAdminUserManagementController>(
    TYPES.IAdminUserManagementController,
  );

  router.use("/dashboard", adminDashboardRoutes(dashboardController));
  router.use("/users", userManagementRoutes(userManagementController));

  return router;
}
