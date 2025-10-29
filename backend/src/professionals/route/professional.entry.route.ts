import { Router } from "express";
import { IProfessionalProfileController } from "../features/profile/interface/IProfessionalProfileController";
import container from "@/config/inversify/inversify.config";
import { TYPES } from "@/common/types/inversify/types";
import { professionalDashboardRoutes } from "../features/dashboard/routes/professional.dashboard";
import { professionalProfileRoutes } from "../features/profile";
import { IProfessionalDashboardController } from "../features/dashboard/interfaces/IProfessionalDashboardController";

export function professionalEntryRoute() {
  const router = Router();

  const professionalProfileController = container.get<IProfessionalProfileController>(
    TYPES.IProfessionalProfileController,
  );
  const professionalDashboardController = container.get<IProfessionalDashboardController>(
    TYPES.IProfessionalDashboardController,
  );
  router.use("/dashboard", professionalDashboardRoutes(professionalDashboardController));
  router.use("/profile", professionalProfileRoutes(professionalProfileController));

  return router;
}
