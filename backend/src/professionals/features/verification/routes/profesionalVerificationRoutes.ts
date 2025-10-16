import { Router } from "express";
import { ProfesionalVerificationController } from "@/professionals";
import { multerMiddleware } from "@/common";
export function profesionalVerificationRoutes(controller: ProfesionalVerificationController) {
  const router = Router();
  router.post("/verification", multerMiddleware, controller.verification.bind(controller));
  router.get("/dashboard", controller.getDashboard.bind(controller));

  return router;
}
