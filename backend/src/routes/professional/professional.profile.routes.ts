import { Router } from "express";
import { busboyUpload, zodValidation } from "@/middleware";
import { IProfessionalProfileController } from "../../interface/professional/IProfessionalProfileController";
import { ProfessionalProfileSchema } from "../../schema/professional/profile.request.schema";
export function professionalProfileRoutes(controller: IProfessionalProfileController) {
  const router = Router();
  router.post(
    "/profile",
    busboyUpload,
    zodValidation(ProfessionalProfileSchema),
    controller.uploadProfile.bind(controller),
  );

  return router;
}
