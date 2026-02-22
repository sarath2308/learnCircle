import { ISessionBookingController } from "@/interface/shared/session-booking/booking/session.booking.controller";
import { validateRequest } from "@/middleware/zodValidation.middlevare";
import { SessionBookingParamsSchema } from "@/schema/learner/session.booking/session.booking.confirm.schema";
import { Router } from "express";

export const sessionBookingRoutes = (controller: ISessionBookingController) => {
  const router = Router();

  router.post(
    "/:bookingId/join",
    validateRequest(SessionBookingParamsSchema),
    controller.checkJoinPermission.bind(controller),
  );

  return router;
};
