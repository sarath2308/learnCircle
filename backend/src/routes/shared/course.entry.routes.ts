import container from "@/di/di.container";
import { Router } from "express";
import { TYPES } from "@/types/shared/inversify/types";
import { wrapAsyncController } from "@/utils/wrapAsyncClass";
import { ICourseController } from "@/interface/shared/course.controller.interface";
import { courseRoutes } from "./course.routes";

export function courseEntryRoute() {
  const router = Router();

  const courseController = wrapAsyncController(
    container.get<ICourseController>(TYPES.ICourseController),
  );
  router.use("/", courseRoutes(courseController));
  //   router.use("/course/lesson", refreshRoutes(refreshController));

  return router;
}
