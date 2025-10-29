import container from "@/config/inversify/inversify.config";
import { Router } from "express";
import { IRefreshController } from "../controller";
import { TYPES } from "../types/inversify/types";
import { IAuthController } from "../interface";
import { authRoutes } from "./auth.routes";
import { refreshRoutes } from "./refresh.routes";

export function authEntryRoute() {
  const router = Router();
  const refreshController = container.get<IRefreshController>(TYPES.IRefreshController);
  const authController = container.get<IAuthController>(TYPES.IAuthController);

  router.use("/", authRoutes(authController));
  router.use("/refresh-token", refreshRoutes(refreshController));

  return router;
}
