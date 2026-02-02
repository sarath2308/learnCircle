import { ILearnerCourseController } from "@/interface/learner/learner.course.controller.interface";
import { validateRequest } from "@/middleware/zodValidation.middlevare";
import { LearnerAllCourseRequestSchema } from "@/schema/learner/course/learner.course.get.all.schema";
import { LearnerCourseGetSchema } from "@/schema/learner/course/learner.course.get.schema";
import { Router } from "express";

export function learnerCourseRoutes(controller: ILearnerCourseController) {
  const router = Router();
  router.get(
    "/",
    validateRequest(LearnerAllCourseRequestSchema),
    controller.getAllCourseDataForUser.bind(controller),
  );
  router.get(
    "/:courseId",
    validateRequest(LearnerCourseGetSchema),
    controller.getCourseForLearner.bind(controller),
  );

  return router;
}
