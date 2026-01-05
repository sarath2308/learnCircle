import { Router } from "express";
import { TYPES } from "../../types/shared/inversify/types";
import container from "@/di/di.container";
import { IAdminDashboardController } from "@/interface/admin/admin.dashboard.controller.interface";
import { IAdminUserManagementController } from "@/interface/admin/admin.userManagement.controller.interface";
import { adminDashboardRoutes } from "./admin.dashboard.routes";
import { userManagementRoutes } from "./admin.userManagement.routes";
import { wrapAsyncController } from "@/utils/wrapAsyncClass";
import { ICategoryController } from "@/interface/admin/category.controller.interface";
import { AdminCategoryRoutes } from "./admin.category.routes";
import { IAdminCourseManagementController } from "@/interface/admin/admin.course.management.controller";
import { adminCourseManagementRoutes } from "./admin.course.manage.routes";

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

  const adminCourseManageController = wrapAsyncController(
    container.get<IAdminCourseManagementController>(TYPES.IAdminCourseManagementController),
  );

  router.use("/dashboard", adminDashboardRoutes(dashboardController));
  router.use("/users", userManagementRoutes(userManagementController));
  router.use("/category", AdminCategoryRoutes(categoryController));
  router.use("/course", adminCourseManagementRoutes(adminCourseManageController));

  return router;
}
