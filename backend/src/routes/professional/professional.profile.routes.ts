import { Router } from "express";
import { busboyUpload } from "@/middleware";
import { validateRequest } from "@/middleware/zodValidation.middlevare";
import { IProfessionalProfileController } from "../../interface/professional/professional.profile.controller.interface";
import { ProfessionalProfileSchema } from "../../schema/professional/profile.request.schema";
export function professionalProfileRoutes(controller: IProfessionalProfileController) {
  const router = Router();
  router.post(
    "/profile",
    busboyUpload,
    validateRequest(ProfessionalProfileSchema),
    controller.uploadProfile.bind(controller),
  );

  return router;
}
