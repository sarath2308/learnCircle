import { IEnrollmentController } from "@/interface/shared/enroll/enrollment.controller.interface";
import { validateRequest } from "@/middleware/zodValidation.middlevare";
import { EnrollmentParamsSchema } from "@/schema/shared/enroll/enrollment.schema";
import { Router } from "express";

export function EnrollmentRoutes(controller: IEnrollmentController) {
  const router = Router();
  router.post(
    "/:courseId/enroll",
    validateRequest(EnrollmentParamsSchema),
    controller.enroll.bind(controller),
  );

  return router;
}
