import { IAdminDashboardService } from "@/interface/admin/admin.dashboard.service.interface";
import { IAdminDashboardController } from "@/interface/admin/admin.dashboard.controller.interface";
import { AdminUserManagementService } from "@/services/admin/admin.userManagement.service";
import { IAdminUserManagementController } from "@/interface/admin/admin.userManagement.controller.interface";
import { IAdminUserManagementService } from "@/interface/admin/admin.userManagement.service.interface";
import { AdminUserManagementController } from "@/controllers/admin/admin.userManagement.controller";
import { AdminDashboardService } from "@/services/admin/admin.dashboard.service";
import { AdminDashboardController } from "@/controllers/admin/admin.dashboard.controller";
import { Admin, IAdmin } from "@/model/admin/Admin";
import { TYPES } from "@/types/shared/inversify/types";
import { Container } from "inversify";
import { Model } from "mongoose";
import { Category, ICategory } from "@/model/admin/Category";
import { ISubcategory, Subcategory } from "@/model/admin/SubCategory";
import { ICategoryRepo } from "@/interface/admin/category.repo.interface";
import { CategoryRepo } from "@/repos/admin/category.repo";
import { ICategoryService } from "@/interface/admin/category.service.interface";
import { CategoryService } from "@/services/shared/category.service";
import { ICategoryController } from "@/interface/admin/category.controller.interface";
import { CategoryController } from "@/controllers/shared/category.controller";
import { IAdminCourseManagementService } from "@/interface/admin/admin.course.manage.interface";
import { AdminCourseManagementService } from "@/services/admin/admin.course.manage.service";
import container from "./di.container";
import { IAdminCourseManagementController } from "@/interface/admin/admin.course.management.controller";
import { AdminCourseManagementController } from "@/controllers/admin/admin.course.manage.controller";

export const registerAdmin = (container: Container): void => {
  /*--------------Models-----------------------*/
  container.bind<Model<IAdmin>>(TYPES.IAdminModel).toConstantValue(Admin);
  container.bind<Model<ICategory>>(TYPES.ICategoryModel).toConstantValue(Category);
  container.bind<Model<ISubcategory>>(TYPES.ISubCategoryModel).toConstantValue(Subcategory);

  /*--------------Repo-----------------------*/
  container.bind<ICategoryRepo>(TYPES.ICategoryRepo).to(CategoryRepo);
  /*--------------Service-------------*/
  container
    .bind<IAdminUserManagementService>(TYPES.IAdminUserManagementService)
    .to(AdminUserManagementService);
  container.bind<IAdminDashboardService>(TYPES.IAdminDashboardService).to(AdminDashboardService);
  container.bind<ICategoryService>(TYPES.ICategoryService).to(CategoryService);
  container
    .bind<IAdminCourseManagementService>(TYPES.IAdminCourseManagementService)
    .to(AdminCourseManagementService);
  /*--------------Controller-------------*/
  container
    .bind<IAdminUserManagementController>(TYPES.IAdminUserManagementController)
    .to(AdminUserManagementController);
  container.bind<ICategoryController>(TYPES.ICategoryController).to(CategoryController);

  container
    .bind<IAdminDashboardController>(TYPES.IAdminDashboardController)
    .to(AdminDashboardController);
};

container
  .bind<IAdminCourseManagementController>(TYPES.IAdminCourseManagementController)
  .to(AdminCourseManagementController);
