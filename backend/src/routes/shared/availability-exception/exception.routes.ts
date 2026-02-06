import { IAvailabilityExceptionController } from "@/interface/shared/session-booking/availability-exception/availability.exception.controller";
import { validateRequest } from "@/middleware/zodValidation.middlevare";
import { ExceptionRemoveSchema } from "@/schema/shared/availability/exception/exception.remove.schema";
import { ExceptionCreateSchema } from "@/schema/shared/availability/exception/exception.request.schema";
import { Router } from "express";

export const exceptionRoutes = (controller: IAvailabilityExceptionController) => {
  const router = Router();
  router.post(
    "/",
    validateRequest(ExceptionCreateSchema),
    controller.createException.bind(controller),
  );
  router.delete(
    "/:exceptionId",
    validateRequest(ExceptionRemoveSchema),
    controller.removeException.bind(controller),
  );
  router.get("/", controller.listException.bind(controller));

  return router;
};
