import { ICategoryController } from "@/interface/shared/category/category.controller.interface";
import { Router } from "express";

export default function categoyRoutes(controller: ICategoryController) {
  const router = Router();

  router.get("/", controller.getCategoryForUser.bind(controller));

  return router;
}
