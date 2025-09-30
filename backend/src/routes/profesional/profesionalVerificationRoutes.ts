import { Router } from "express";
import { ProfesionalVerificationController } from "../../controllers/profesional/profesional.verification.controller";
import { multerMiddleware } from "../../middleware/multer.middleware";
export function profesionalVerificationRoutes(controller: ProfesionalVerificationController) {
  const router = Router();
  router.post("/verification", multerMiddleware, controller.verification.bind(controller));
  router.get("/dashboard", controller.getDashboard.bind(controller));

  return router;
}
