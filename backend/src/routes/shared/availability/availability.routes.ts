import { IAvailabilityController } from "@/interface/shared/session-booking/availabillity/availability.controller.interface";
import { validateRequest } from "@/middleware/zodValidation.middlevare";
import { CreateAvailabilitySchema } from "@/schema/shared/availability/availability.create.schema";
import { RemoveAvailabilitySchema } from "@/schema/shared/availability/availability.remove.schema";
import { UpdateAvailabilitySchema } from "@/schema/shared/availability/availability.update.schema";
import { Router } from "express";

export function availabilityRoutes(controller: IAvailabilityController) {
  const router = Router();

  router.post(
    "/",
    validateRequest(CreateAvailabilitySchema),
    controller.createAvailability.bind(controller),
  );
  router.patch(
    "/:availabilityId",
    validateRequest(UpdateAvailabilitySchema),
    controller.updateAvailability.bind(controller),
  );
  router.delete(
    "/:availabilityId",
    validateRequest(RemoveAvailabilitySchema),
    controller.removeAvailability.bind(controller),
  );
  router.get("/", controller.getAllAvailabilityRules.bind(controller));

  return router;
}
