import { IChapterController } from "@/interface/shared/chapter/chapter.controller.interface";
import { validateRequest } from "@/middleware/zodValidation.middlevare";
import { chapterCreateSchema } from "@/schema/shared/chapter/chapter.create.schema";
import { chapterEditSchema } from "@/schema/shared/chapter/chapter.edit.schema";
import { chapterRemoveSchema } from "@/schema/shared/chapter/chapter.remove";
import { Router } from "express";

export function chapterRoutes(controller: IChapterController) {
  const router = Router();
  router.post(
    "/:courseId/chapter",
    validateRequest(chapterCreateSchema),
    controller.createChapter.bind(controller),
  );
  router.patch(
    "chapter/:chapterId",
    validateRequest(chapterEditSchema),
    controller.editChapter.bind(controller),
  );
  router.delete(
    "chapter/:chapterId/remove",
    validateRequest(chapterRemoveSchema),
    controller.removeChapter.bind(controller),
  );

  return router;
}
