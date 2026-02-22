import { ICourseController } from "@/interface/shared/course/course.controller.interface";
import { Router } from "express";
import { creatorCourseRoutes } from "./course.creator.routes";
import { wrapAsyncController } from "@/utils/wrapAsyncClass";
import container from "@/di/di.container";
import { TYPES } from "@/types/shared/inversify/types";

export const creatorEntryRoutes = () => {
  const courseController = wrapAsyncController(
    container.get<ICourseController>(TYPES.ICourseController),
  );
  const router = Router();
  router.use("/course", creatorCourseRoutes(courseController));

  return router;
};
