import container from "@/di/di.container";
import { Router } from "express";
import { TYPES } from "@/types/shared/inversify/types";
import { wrapAsyncController } from "@/utils/wrapAsyncClass";
import { ICourseController } from "@/interface/shared/course/course.controller.interface";
import { courseRoutes } from "./course.routes";
import { IChapterController } from "@/interface/shared/chapter/chapter.controller.interface";
import { chapterRoutes } from "../chapter/chapter.routes";

export function courseEntryRoute() {
  const router = Router();

  const courseController = wrapAsyncController(
    container.get<ICourseController>(TYPES.ICourseController),
  );

  const chapterController = container.get<IChapterController>(TYPES.IChapterController);

  router.use("/", courseRoutes(courseController));
  router.use("/", chapterRoutes(chapterController));
  //   router.use("/course/lesson", refreshRoutes(refreshController));

  return router;
}
