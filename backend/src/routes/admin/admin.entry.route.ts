import { Router } from "express";
import { TYPES } from "../../types/shared/inversify/types";
import container from "@/di/di.container";
import { IAdminDashboardController } from "@/interface/admin/IAdminDashboardController";
import { IAdminUserManagementController } from "@/interface/admin/IAdminUserManagementController";
import { adminDashboardRoutes } from "./admin.dashboard.routes";
import { userManagementRoutes } from "./admin.userManagement.routes";
import { wrapAsyncController } from "@/utils/wrapAsyncClass";
import { ICategoryController } from "@/interface/admin/category.controller.interface";
import { categoryRoutes } from "./admin.category.routes";
export function adminEntryRoute() {
  const router = Router();
  const dashboardController = wrapAsyncController(
    container.get<IAdminDashboardController>(TYPES.IAdminDashboardController),
  );

  const userManagementController = wrapAsyncController(
    container.get<IAdminUserManagementController>(TYPES.IAdminUserManagementController),
  );

  const categoryController = wrapAsyncController(
    container.get<ICategoryController>(TYPES.ICategoryController),
  );

  router.use("/dashboard", adminDashboardRoutes(dashboardController));
  router.use("/users", userManagementRoutes(userManagementController));
  router.use("/category", categoryRoutes(categoryController));

  return router;
}
