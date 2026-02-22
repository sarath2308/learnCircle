import { ISubCategoryController } from "@/interface/shared/category/subCat/sub.category.controller.interface";
import { Router } from "express";

export default function subCategoryRoutes(controller: ISubCategoryController) {
  const router = Router();

  router.get("/:categoryId/sub-categories", controller.getSubCategoryByCategoryId.bind(controller));

  return router;
}
