import { ICourseController } from "@/interface/shared/course/course.controller.interface";
import { Router } from "express";

export function creatorCourseRoutes(controller: ICourseController) {
  const router = Router();

  router.get("/", controller.getCouseDataForCourseManagement.bind(controller));
  router.get("/:id", controller.getCourseDataForCreatorView.bind(controller));
  router.patch("/:id/publish", controller.publishCourse.bind(controller));

  return router;
}
