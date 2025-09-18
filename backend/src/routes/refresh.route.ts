import { Router } from "express";
import { IRefreshController } from "../controllers/refreshController";
export function refreshRoutes(controller: IRefreshController) {
  const router = Router();
  router.post("/refresh-token", controller.refreshToken.bind(controller));

  return router;
}
