import { ISubCategoryController } from "@/interface/shared/category/subCat/sub.category.controller.interface";
import { validateRequest } from "@/middleware/zodValidation.middlevare";
import { SubCategoryBlockSchema } from "@/schema/shared/category/sub/sub.category.block";
import { SubCategoryCreateSchema } from "@/schema/shared/category/sub/sub.category.create";
import { SubCategoryUnBlockSchema } from "@/schema/shared/category/sub/sub.category.unblock";
import { SubCategoryUpdateSchema } from "@/schema/shared/category/sub/sub.category.update";
import { Router } from "express";

export default function subCategoryAdminRoutes(controller: ISubCategoryController) {
  const router = Router();
  router.get("/", controller.listSubCategoryForAdmin.bind(controller));
  router.post(
    "/",
    validateRequest(SubCategoryCreateSchema),
    controller.createSubCategory.bind(controller),
  );
  router.patch(
    "/:id",
    validateRequest(SubCategoryUpdateSchema),
    controller.updateSubCategory.bind(controller),
  );
  router.patch(
    "/unblock/:id",
    validateRequest(SubCategoryUnBlockSchema),
    controller.unblockSubCategory.bind(controller),
  );
  router.patch(
    "/block/:id",
    validateRequest(SubCategoryBlockSchema),
    controller.blockSubCategory.bind(controller),
  );

  return router;
}
