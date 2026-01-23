import { ILessonController } from "@/interface/shared/lesson/lesson.controller.interface";
import { busboyUpload } from "@/middleware";
import { validateRequest } from "@/middleware/zodValidation.middlevare";
import { createLessonSchema } from "@/schema/shared/lesson/lesson.create.schema";
import { createLessonWithVideoSchema } from "@/schema/shared/lesson/lesson.create.video.schema";
import { deleteLessonSchema } from "@/schema/shared/lesson/lesson.delete.schema";
import { GetLessonSchema } from "@/schema/shared/lesson/lesson.get.schema";
import { UpdateLessonSchema } from "@/schema/shared/lesson/lesson.update.schema";
import { Router } from "express";

export function lessonRoutes(lessonController: ILessonController) {
  const router = Router();
  router.post(
    "/:chapterId/lesson",
    busboyUpload,
    validateRequest(createLessonSchema),
    lessonController.createLesson.bind(lessonController),
  );
  router.post(
    "/:chapterId/lesson/video",
    busboyUpload,
    validateRequest(createLessonWithVideoSchema),
    lessonController.createLessonWithVideo.bind(lessonController),
  );
  router.get(
    "/lesson/:lessonId",
    validateRequest(GetLessonSchema),
    lessonController.getLessonById.bind(lessonController),
  );
  router.put(
    "/lesson/:lessonId",
    validateRequest(UpdateLessonSchema),
    busboyUpload,
    lessonController.updateLesson.bind(lessonController),
  );
  router.delete(
    "/lesson/:lessonId",
    validateRequest(deleteLessonSchema),
    lessonController.deleteLesson.bind(lessonController),
  );
  router.patch(
    "/lesson/:lessonId/finalize",
    lessonController.finalizeLessonVideo.bind(lessonController),
  );
  router.patch(
    "/lesson/:lessonId/change-order",
    lessonController.changeLessonOrder.bind(lessonController),
  );

  return router;
}
