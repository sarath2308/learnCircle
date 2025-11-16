import { Router } from "express";
import { IRefreshController } from "../controller";
export function refreshRoutes(controller: IRefreshController) {
  const router = Router();
  router.post("/", controller.refreshToken.bind(controller));

  return router;
}
