import { ISessionBookingController } from "@/interface/shared/session-booking/booking/session.booking.controller";
import { validateRequest } from "@/middleware/zodValidation.middlevare";
import { SessionBookingParamsSchema } from "@/schema/learner/session.booking/session.booking.confirm.schema";
import { SessionBookingRequestSchema } from "@/schema/learner/session.booking/session.booking.request.schema";
import { Router } from "express";

export const LearnerSessionBookingRoutes = (controller: ISessionBookingController) => {
  const router = Router();

  router.post(
    "/create",
    validateRequest(SessionBookingRequestSchema),
    controller.createSession.bind(controller),
  );

  router.post(
    "/confirm/:bookingId",
    validateRequest(SessionBookingParamsSchema),
    controller.confirmBooking.bind(controller),
  );
  router.get("/my-bookings", controller.getAllBookingForUser.bind(controller));

  return router;
};
