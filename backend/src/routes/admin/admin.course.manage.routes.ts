import { IAdminCourseManagementController } from "@/interface/admin/admin.course.management.controller";
import { Router } from "express";

export function adminCourseManagementRoutes(controller: IAdminCourseManagementController) {
  const router = Router();

  router.get("/course", controller.getAllCourse.bind(controller));
  router.get("/course/:courseId", controller.getCourseData.bind(controller));
  router.patch("/course/:courseId/approve", controller.approveCourse.bind(controller));
  router.patch("/course/:courseId/reject", controller.rejectCourse.bind(controller));
  router.patch("/course/:courseId/block", controller.blockCourse.bind(controller));
  router.patch("/course/:courseId/unblock", controller.unblock.bind(controller));

  return router;
}
