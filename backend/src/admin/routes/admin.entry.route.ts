import { Router } from "express";
import { TYPES } from "../../common/types/inversify/types";
import container from "@/config/inversify/inversify.config";
import { IAdminDashboardController } from "../features/dashboard/interface/IAdminDashboardController";
import { IAdminUserManagementController } from "../features/userManagement/interfaces/IAdminUserManagementController";
import { adminDashboardRoutes } from "../features/dashboard/routes/admin.dashboard.routes";
import { userManagementRoutes } from "../features/userManagement/routes/admin.userManagement.routes";
export function adminEntryRoute() {
  const router = Router();
  let dashboardController = container.get<IAdminDashboardController>(
    TYPES.IAdminDashboardController,
  );
  let userManagementController = container.get<IAdminUserManagementController>(
    TYPES.IAdminUserManagementController,
  );

  router.use("/dashboard", adminDashboardRoutes(dashboardController));
  router.use("/users", userManagementRoutes(userManagementController));

  return router;
}
