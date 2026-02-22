import { IAvailabilityController } from "@/interface/shared/session-booking/availabillity/availability.controller.interface";
import { validateRequest } from "@/middleware/zodValidation.middlevare";
import { LearnerGetAvailabilitySchema } from "@/schema/learner/availability/learner.get.availability";
import { Router } from "express";

export function learnerAvailabilityRoutes(controller: IAvailabilityController) {
  const router = Router();

  router.get(
    "/",
    validateRequest(LearnerGetAvailabilitySchema),
    controller.getAllAvailabilityOfInstructor.bind(controller),
  );

  return router;
}
