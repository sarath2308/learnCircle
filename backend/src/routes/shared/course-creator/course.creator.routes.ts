import { ICourseController } from "@/interface/shared/course/course.controller.interface";
import { Router } from "express";

export function creatorCourseRoutes(controller: ICourseController) {
  const router = Router();

  router.get("/", controller.getCouseDataForCourseManagement.bind(controller));
  router.get("/:id", controller.getCourseById.bind(controller));

  return router;
}
