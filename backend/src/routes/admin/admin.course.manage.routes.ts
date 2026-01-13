import { IAdminCourseManagementController } from "@/interface/admin/admin.course.management.controller";
import { validateRequest } from "@/middleware/zodValidation.middlevare";
import { adminCourseCrudParams } from "@/schema/admin/course/admin.course.params.schema";
import { Router } from "express";

export function adminCourseManagementRoutes(controller: IAdminCourseManagementController) {
  const router = Router();

  router.get("/", controller.getAllCourse.bind(controller));
  router.get(
    "/:courseId",
    validateRequest(adminCourseCrudParams),
    controller.getCourseData.bind(controller),
  );
  router.patch(
    "/:courseId/approve",
    validateRequest(adminCourseCrudParams),
    controller.approveCourse.bind(controller),
  );
  router.patch(
    "/:courseId/reject",
    validateRequest(adminCourseCrudParams),
    controller.rejectCourse.bind(controller),
  );
  router.patch(
    "/:courseId/block",
    validateRequest(adminCourseCrudParams),
    controller.blockCourse.bind(controller),
  );
  router.patch(
    "/:courseId/unblock",
    validateRequest(adminCourseCrudParams),
    controller.unblock.bind(controller),
  );

  return router;
}
