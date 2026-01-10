import { IAdminCourseManagementController } from "@/interface/admin/admin.course.management.controller";
import { Router } from "express";

export function adminCourseManagementRoutes(controller: IAdminCourseManagementController) {
  const router = Router();

  router.get("/", controller.getAllCourse.bind(controller));
  router.get("/:courseId", controller.getCourseData.bind(controller));
  router.patch("/:courseId/approve", controller.approveCourse.bind(controller));
  router.patch("/:courseId/reject", controller.rejectCourse.bind(controller));
  router.patch("/:courseId/block", controller.blockCourse.bind(controller));
  router.patch("/:courseId/unblock", controller.unblock.bind(controller));

  return router;
}
