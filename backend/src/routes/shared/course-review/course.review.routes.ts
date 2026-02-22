import { ICourseReviewController } from "@/interface/shared/course-review/course.review.controller.interface";
import { validateRequest } from "@/middleware/zodValidation.middlevare";
import { CreateCourseReviewSchema } from "@/schema/shared/review/course-review/course.create.review.schema";
import { GetCourseReviewSchema } from "@/schema/shared/review/course-review/course.get.review.schema";
import { RemoveCourseReviewSchema } from "@/schema/shared/review/course-review/course.review.remove.schema";
import { UpdateCourseReviewSchema } from "@/schema/shared/review/course-review/course.update.review.schema";
import { Router } from "express";

export const CourseReviewRoutes = (controller: ICourseReviewController) => {
  const router = Router();
  (router.get(
    "/:courseId",
    validateRequest(GetCourseReviewSchema),
    controller.getAllReview.bind(controller),
  ),
    router.post(
      "/:courseId",
      validateRequest(CreateCourseReviewSchema),
      controller.createReview.bind(controller),
    ));
  router.patch(
    "/:reviewId",
    validateRequest(UpdateCourseReviewSchema),
    controller.editReview.bind(controller),
  );
  router.delete(
    "/:reviewId",
    validateRequest(RemoveCourseReviewSchema),
    controller.removeReview.bind(controller),
  );

  return router;
};
