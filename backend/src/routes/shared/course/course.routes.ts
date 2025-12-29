import { ICourseController } from "@/interface/shared/course/course.controller.interface";
import { busboyUpload } from "@/middleware";
import { validateRequest } from "@/middleware/zodValidation.middlevare";
import { createCourseSchema } from "@/schema/shared/course/course.create.schema";
import { coursePriceSchema } from "@/schema/shared/course/course.pricing.schema";
import { Router } from "express";

export function courseRoutes(controller: ICourseController) {
  const router = Router();

  router.post(
    "/",
    busboyUpload,
    validateRequest(createCourseSchema),
    controller.createCourse.bind(controller),
  );
  router.post(
    "/:id/pricing",
    validateRequest(coursePriceSchema),
    controller.updatePrice.bind(controller),
  );

  return router;
}
