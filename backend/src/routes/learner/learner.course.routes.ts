import { ILearnerCourseController } from "@/interface/learner/learner.course.controller.interface";
import { validateRequest } from "@/middleware/zodValidation.middlevare";
import { LearnerCourseGetSchema } from "@/schema/learner/course/learner.course.get.schema";
import { Router } from "express";

export function learnerCourseRoutes(controller: ILearnerCourseController) {
  const router = Router();

  router.get(
    "/:courseId",
    validateRequest(LearnerCourseGetSchema),
    controller.getCourseForLearner.bind(controller),
  );

  return router;
}
