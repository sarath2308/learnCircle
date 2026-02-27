import { ICourseController } from "@/interface/shared/course/course.controller.interface";
import { busboyUpload } from "@/middleware";
import { validateRequest } from "@/middleware/zodValidation.middlevare";
import { createCourseSchema } from "@/schema/shared/course/course.create.schema";
import { coursePriceSchema } from "@/schema/shared/course/course.pricing.schema";
import { updateCourseSchema } from "@/schema/shared/course/course.update.schema";
import { Router } from "express";

export function courseRoutes(controller: ICourseController) {
  const router = Router();

  // router.get("/", controller.getCouseDataForCourseManagement.bind(controller));
  router.get("/:id", controller.getCourseById.bind(controller));
  router.get(
    "/professional/total-course",
    controller.getTotalCourseCreatedByInstructor.bind(controller),
  );
  router.get(
    "/professional/top-course",
    controller.getTopCoursesCreatedByInstructor.bind(controller),
  );
  router.get(
    "/professional/total-enrolled",
    controller.getTotalEnrolledCountForInstructor.bind(controller),
  );
  router.get("/admin/total-course", controller.getTotalActiveCourseForAdmin.bind(controller));
  router.post(
    "/",
    busboyUpload,
    validateRequest(createCourseSchema),
    controller.createCourse.bind(controller),
  );
  router.patch(
    "/:courseId",
    busboyUpload,
    validateRequest(updateCourseSchema),
    controller.editCourse.bind(controller),
  );
  router.patch(
    "/:courseId/pricing",
    validateRequest(coursePriceSchema),
    controller.updatePrice.bind(controller),
  );

  return router;
}
