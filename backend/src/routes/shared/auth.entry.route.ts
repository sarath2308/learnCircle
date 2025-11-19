import container from "@/di/di.container";
import { Router } from "express";
import { IRefreshController } from "@/controllers/shared/refreshController";
import { TYPES } from "@/types/shared/inversify/types";
import { IAuthController } from "@/interface/shared/IAuthController";
import { authRoutes } from "./auth.routes";
import { refreshRoutes } from "./refresh.routes";
import { wrapAsyncController } from "@/utils/wrapAsyncClass";
export function authEntryRoute() {
  const router = Router();
  const refreshController = wrapAsyncController(
    container.get<IRefreshController>(TYPES.IRefreshController),
  );
  const authController = wrapAsyncController(container.get<IAuthController>(TYPES.IAuthController));

  router.use("/", authRoutes(authController));
  router.use("/refresh-token", refreshRoutes(refreshController));

  return router;
}
