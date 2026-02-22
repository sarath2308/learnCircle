import { IInstructorReviewController } from "@/interface/shared/instuctor-review/instructor.review.controller";
import { validateRequest } from "@/middleware/zodValidation.middlevare";
import { GetInstructorReviewSchema } from "@/schema/shared/review/instructor-review/instructor.get.review.schema";
import { RemoveInstructorReviewSchema } from "@/schema/shared/review/instructor-review/instructor.remove.review.schema";
import { CreateInstructorReviewSchema } from "@/schema/shared/review/instructor-review/instructor.review.create.schema";
import { UpdateInstructorReviewSchema } from "@/schema/shared/review/instructor-review/instructor.update.review.schema";
import { Router } from "express";

export const InstructorReviewRoutes = (controller: IInstructorReviewController) => {
  const router = Router();

  router.get(
    "/:instructorId",
    validateRequest(GetInstructorReviewSchema),
    controller.getAllReview.bind(controller),
  );
  router.post(
    "/:instructorId",
    validateRequest(CreateInstructorReviewSchema),
    controller.createReview.bind(controller),
  );
  router.patch(
    "/:reviewId",
    validateRequest(UpdateInstructorReviewSchema),
    controller.editReview.bind(controller),
  );
  router.delete(
    "/:reviewId",
    validateRequest(RemoveInstructorReviewSchema),
    controller.removeReview.bind(controller),
  );

  return router;
};
