import { ISessionBookingController } from "@/interface/shared/session-booking/booking/session.booking.controller";
import { validateRequest } from "@/middleware/zodValidation.middlevare";
import { SessionBookingConfirmSchema } from "@/schema/learner/session.booking/session.booking.confirm.schema";
import { SessionBookingRequestSchema } from "@/schema/learner/session.booking/session.booking.request.schema";
import { Router } from "express";

export const sessionBookingRoutes = (controller: ISessionBookingController) => {
  const router = Router();

  router.post("/create", validateRequest(SessionBookingRequestSchema), controller.createSession);
  router.post(
    "/confirm/:bookingId",
    validateRequest(SessionBookingConfirmSchema),
    controller.confirmBooking,
  );
  // router.get("/user-bookings", controller.getAllBookingForUser);
  // router.get("/instructor-bookings", controller.getAllBoookingForInstructor);
  // router.post("/cancel/:bookingId", controller.cancelBooking);

  return router;
};
