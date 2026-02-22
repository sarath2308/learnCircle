import { ICategoryController } from "@/interface/shared/category/category.controller.interface";
import { validateRequest } from "@/middleware/zodValidation.middlevare";
import { CategoryBlockSchema } from "@/schema/shared/category/category.block.schema";
import { CategoryCreateSchema } from "@/schema/shared/category/category.create.schema";
import { CategoryUnBlockSchema } from "@/schema/shared/category/category.unblock.schema";
import { CategoryUpdateSchema } from "@/schema/shared/category/category.update.schema";
import { Router } from "express";

export function AdminCategoryRoutes(controller: ICategoryController) {
  const router = Router();
  router.get("/", controller.listCategoryForAdmin.bind(controller));
  router.post(
    "/",
    validateRequest(CategoryCreateSchema),
    controller.createCategory.bind(controller),
  );
  router.patch(
    "/:id",
    validateRequest(CategoryUpdateSchema),
    controller.updateCategory.bind(controller),
  );
  router.patch(
    "/unblock/:id",
    validateRequest(CategoryUnBlockSchema),
    controller.unblockCategory.bind(controller),
  );
  router.patch(
    "/block/:id",
    validateRequest(CategoryBlockSchema),
    controller.blockCategory.bind(controller),
  );

  return router;
}
