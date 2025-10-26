import { Router } from "express";
import { IProfessionalDashboardController } from "../interfaces/IProfessionalDashboardController";

export function professionalDashboardRoutes(controller: IProfessionalDashboardController) {
  const router = Router();
  router.get("/", controller.getDashboard.bind(controller));
  return router;
}
