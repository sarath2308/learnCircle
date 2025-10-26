import { Router } from "express";
import { multerMiddleware, zodValidation } from "@/common/middleware";
import { IProfessionalProfileController } from "../interface/IProfessionalProfileController";
import { ProfessionalProfileSchema } from "../dtos/profile.request.schema";
export function professionalProfileRoutes(controller: IProfessionalProfileController) {
  const router = Router();
  router.post(
    "/profile",
    multerMiddleware,
    zodValidation(ProfessionalProfileSchema),
    controller.uploadProfile.bind(controller),
  );

  return router;
}
