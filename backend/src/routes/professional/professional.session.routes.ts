import { ISessionBookingController } from "@/interface/shared/session-booking/booking/session.booking.controller";
import { validateRequest } from "@/middleware/zodValidation.middlevare";
import { ProfessionalSessionBookingParamsSchema } from "@/schema/professional/session-booking/professiona.session.params.schema";
import { Router } from "express";

export const porfessionalSessionRoutes = (controller: ISessionBookingController) => {
  const router = Router();
  router.get("/", controller.getAllBoookingForInstructor.bind(controller));
  router.post(
    "/:sessionId/mark-completed",
    validateRequest(ProfessionalSessionBookingParamsSchema),
    controller.markSessionAsCompleted.bind(controller),
  );

  return router;
};
