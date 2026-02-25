import container from "@/di/di.container";
import { Router } from "express";
import { TYPES } from "@/types/shared/inversify/types";
import { wrapAsyncController } from "@/utils/wrapAsyncClass";
import { ICourseController } from "@/interface/shared/course/course.controller.interface";
import { courseRoutes } from "./course.routes";
import { IChapterController } from "@/interface/shared/chapter/chapter.controller.interface";
import { chapterRoutes } from "../chapter/chapter.routes";
import { ILessonController } from "@/interface/shared/lesson/lesson.controller.interface";
import { lessonRoutes } from "../lesson/lesson.routes";
import { EnrollmentRoutes } from "../enrollment/enrollment.routes";
import { IEnrollmentController } from "@/interface/shared/enroll/enrollment.controller.interface";

export function courseEntryRoute() {
  const router = Router();

  const courseController = wrapAsyncController(
    container.get<ICourseController>(TYPES.ICourseController),
  );
  const lessonController = wrapAsyncController(
    container.get<ILessonController>(TYPES.ILessonController),
  );
  const chapterController = container.get<IChapterController>(TYPES.IChapterController);
  const enrollmentController = wrapAsyncController(
    container.get<IEnrollmentController>(TYPES.IEnrollmentController),
  );

  router.use("/", courseRoutes(courseController));
  router.use("/", chapterRoutes(chapterController));
  router.use("/chapter", lessonRoutes(lessonController));
  router.use("/", EnrollmentRoutes(enrollmentController));

  return router;
}
