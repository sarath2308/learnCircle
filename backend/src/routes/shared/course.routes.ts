import { ICourseController } from "@/interface/shared/course.controller.interface";
import { validateRequest } from "@/middleware/zodValidation.middlevare";
import { createCourseSchema } from "@/schema/shared/course.create.schema";
import { coursePriceSchema } from "@/schema/shared/course.pricing.schema";
import { Router } from "express";

export function courseRoutes(controller: ICourseController) {
  const router = Router();

  router.post("/", validateRequest(createCourseSchema), controller.createCourse.bind(controller));
  router.post(
    "/:id/pricing",
    validateRequest(coursePriceSchema),
    controller.updatePrice.bind(controller),
  );

  return router;
}
