import { Router } from "express";
import { IRefreshController } from "@/controllers/shared/refreshController";
export function refreshRoutes(controller: IRefreshController) {
  const router = Router();
  router.post("/", controller.refreshToken.bind(controller));

  return router;
}
