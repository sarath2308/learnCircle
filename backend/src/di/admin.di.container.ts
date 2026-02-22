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
import { Category, ICategory } from "@/model/shared/Category";
import { ISubcategory, Subcategory } from "@/model/shared/SubCategory";
import { ICategoryRepo } from "@/interface/shared/category/category.repo.interface";
import { CategoryRepo } from "@/repos/admin/category.repo";
import { ICategoryService } from "@/interface/shared/category/category.service.interface";
import { CategoryService } from "@/services/shared/category/category.service";
import { ICategoryController } from "@/interface/shared/category/category.controller.interface";
import { CategoryController } from "@/controllers/shared/category.controller";
import { IAdminCourseManagementService } from "@/interface/admin/admin.course.manage.interface";
import { AdminCourseManagementService } from "@/services/admin/admin.course.manage.service";
import { IAdminCourseManagementController } from "@/interface/admin/admin.course.management.controller";
import { AdminCourseManagementController } from "@/controllers/admin/admin.course.manage.controller";
import { ISubCategoryRepo } from "@/interface/shared/category/subCat/sub.category.repo.interface";
import { SubCategoryRepo } from "@/repos/admin/subCategory.repo";
import { ISubCategoryService } from "@/interface/shared/category/subCategory.service.interface";
import { SubCategoryService } from "@/services/shared/category/sub.category.sevice";
import { ISubCategoryController } from "@/interface/shared/category/subCat/sub.category.controller.interface";
import { SubCategoryController } from "@/controllers/shared/sub.category.controller";

export const registerAdmin = (container: Container): void => {
  /*--------------Models-----------------------*/
  container.bind<Model<IAdmin>>(TYPES.IAdminModel).toConstantValue(Admin);
  container.bind<Model<ICategory>>(TYPES.ICategoryModel).toConstantValue(Category);
  container.bind<Model<ISubcategory>>(TYPES.ISubCategoryModel).toConstantValue(Subcategory);

  /*--------------Repo-----------------------*/
  container.bind<ICategoryRepo>(TYPES.ICategoryRepo).to(CategoryRepo);
  container.bind<ISubCategoryRepo>(TYPES.ISubCategoryRepo).to(SubCategoryRepo);
  /*--------------Service-------------*/
  container
    .bind<IAdminUserManagementService>(TYPES.IAdminUserManagementService)
    .to(AdminUserManagementService);
  container.bind<IAdminDashboardService>(TYPES.IAdminDashboardService).to(AdminDashboardService);
  container.bind<ICategoryService>(TYPES.ICategoryService).to(CategoryService);
  container
    .bind<IAdminCourseManagementService>(TYPES.IAdminCourseManagementService)
    .to(AdminCourseManagementService);
  container.bind<ISubCategoryService>(TYPES.ISubCategoryService).to(SubCategoryService);
  /*--------------Controller-------------*/
  container
    .bind<IAdminUserManagementController>(TYPES.IAdminUserManagementController)
    .to(AdminUserManagementController);
  container.bind<ICategoryController>(TYPES.ICategoryController).to(CategoryController);

  container
    .bind<IAdminDashboardController>(TYPES.IAdminDashboardController)
    .to(AdminDashboardController);

  container
    .bind<IAdminCourseManagementController>(TYPES.IAdminCourseManagementController)
    .to(AdminCourseManagementController);
  container.bind<ISubCategoryController>(TYPES.ISubCategoryController).to(SubCategoryController);
};
