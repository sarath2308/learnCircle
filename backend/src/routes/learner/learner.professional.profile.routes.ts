import { ILearnerProfessionalProfileController } from "@/interface/learner/learner.professional.profile.controller";
import { validateRequest } from "@/middleware/zodValidation.middlevare";
import { LearnerProfessionalsRequestSchema } from "@/schema/learner/professional-profile/learner.professional.profiles.request.schemat";
import { Router } from "express";

export const learnerProfessionalProfileRoutes = (
  controller: ILearnerProfessionalProfileController,
) => {
  const router = Router();

  router.get(
    "/",
    validateRequest(LearnerProfessionalsRequestSchema),
    controller.getAllProfiles.bind(controller),
  );

  return router;
};
