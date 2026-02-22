import { ICourseController } from "@/interface/shared/course/course.controller.interface";
import { validateRequest } from "@/middleware/zodValidation.middlevare";
import { creatorCourseManagementSchema } from "@/schema/shared/course/creator/course.manage.schema";
import { Router } from "express";

export function creatorCourseRoutes(controller: ICourseController) {
  const router = Router();

  router.get(
    "/",
    validateRequest(creatorCourseManagementSchema),
    controller.getCouseDataForCourseManagement.bind(controller),
  );
  router.get("/:id", controller.getCourseDataForCreatorView.bind(controller));
  router.patch("/:id/publish", controller.publishCourse.bind(controller));

  return router;
}
