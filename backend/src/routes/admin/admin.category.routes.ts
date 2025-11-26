import { ICategoryController } from "@/interface/admin/category.controller.interface";
import { validateRequest } from "@/middleware/zodValidation.middlevare";
import { CategoryBlockSchema } from "@/schema/admin/category/category.block.schema";
import { CategoryCreateSchema } from "@/schema/admin/category/category.create.schema";
import { CategoryUnBlockSchema } from "@/schema/admin/category/category.unblock.schema";
import { CategoryUpdateSchema } from "@/schema/admin/category/category.update.schema";
import { Router } from "express";

export function categoryRoutes(controller: ICategoryController) {
  const router = Router();
  router.get("/", controller.listCategory.bind(controller));
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
