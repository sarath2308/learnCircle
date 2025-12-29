import { Router } from "express";
import container from "@/di/di.container";
import { TYPES } from "@/types/shared/inversify/types";
import { professionalDashboardRoutes } from "./professional.dashboard";
import { professionalProfileRoutes } from "./professional.profile.routes";
import { IProfessionalDashboardController } from "@/interface/professional/professional.dashboard.controller.interface";
import { IProfessionalProfileController } from "@/interface/professional/professional.profile.controller.interface";
import { wrapAsyncController } from "@/utils/wrapAsyncClass";

export function professionalEntryRoute() {
  const router = Router();

  const professionalProfileController = wrapAsyncController(
    container.get<IProfessionalProfileController>(TYPES.IProfessionalProfileController),
  );
  const professionalDashboardController = wrapAsyncController(
    container.get<IProfessionalDashboardController>(TYPES.IProfessionalDashboardController),
  );
  router.use("/dashboard", professionalDashboardRoutes(professionalDashboardController));
  router.use("/profile", professionalProfileRoutes(professionalProfileController));

  return router;
}
