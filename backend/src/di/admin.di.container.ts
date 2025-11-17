import { IAdminDashboardService } from "@/interface/admin/IAdminDashboardService";
import { IAdminDashboardController } from "@/interface/admin/IAdminDashboardController";
import { AdminUserManagementService } from "@/services/admin/admin.userManagement.service";
import { IAdminUserManagementController } from "@/interface/admin/IAdminUserManagementController";
import { IAdminUserManagementService } from "@/interface/admin/IAdminUserManagementService";
import { AdminUserManagementController } from "@/controllers/admin/admin.userManagement.controller";
import { AdminDashboardService } from "@/services/admin/admin.dashboard.service";
import { AdminDashboardController } from "@/controllers/admin/admin.dashboard.controller";
import { Admin, IAdmin } from "@/model/admin/Admin";
import { TYPES } from "@/types/shared/inversify/types";
import { Container } from "inversify";
import { Model } from "mongoose";
import { Category, ICategory } from "@/model/admin/Category";
import { ISubcategory, Subcategory } from "@/model/admin/SubCategory";

export const registerAdmin = (container: Container): void => {
  /*--------------Models-----------------------*/
  container.bind<Model<IAdmin>>(TYPES.IAdminModel).toConstantValue(Admin);
  container.bind<Model<ICategory>>(TYPES.ICategoryModel).toConstantValue(Category);
  container.bind<Model<ISubcategory>>(TYPES.ISubCategoryModel).toConstantValue(Subcategory);
  /*--------------Service-------------*/
  container
    .bind<IAdminUserManagementService>(TYPES.IAdminUserManagementService)
    .to(AdminUserManagementService);
  container.bind<IAdminDashboardService>(TYPES.IAdminDashboardService).to(AdminDashboardService);

  /*--------------Controller-------------*/
  container
    .bind<IAdminUserManagementController>(TYPES.IAdminUserManagementController)
    .to(AdminUserManagementController);

  container
    .bind<IAdminDashboardController>(TYPES.IAdminDashboardController)
    .to(AdminDashboardController);
};
