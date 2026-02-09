import container from "@/di/di.container";
import { Router } from "express";
import { ILearnerHomeController } from "@/interface/learner/learner.home.controller.interface";
import { TYPES } from "@/types/shared/inversify/types";
import { ILearnerProfileController } from "@/interface/learner/learner.profile.controller.interface";
import { learnerHomeRoute } from "./learner.home.route.";
import { learnerProfileRoute } from "./learner.profile.route";
import { wrapAsyncController } from "@/utils/wrapAsyncClass";
import { ILearnerCourseController } from "@/interface/learner/learner.course.controller.interface";
import { learnerCourseRoutes } from "./learner.course.routes";
import { ILearnerProfessionalProfileController } from "@/interface/learner/learner.professional.profile.controller";
import { learnerProfessionalProfileRoutes } from "./learner.professional.profile.routes";
import { IAvailabilityController } from "@/interface/shared/session-booking/availabillity/availability.controller.interface";
import { learnerAvailabilityRoutes } from "./learner.availability.routes";

export function learnerEntryRoute() {
  const router = Router();
  const learnerHomeController = wrapAsyncController(
    container.get<ILearnerHomeController>(TYPES.ILearnerHomeController),
  );
  const learnerProfileController = wrapAsyncController(
    container.get<ILearnerProfileController>(TYPES.ILearnerProfileController),
  );
  const learnerCourseController = wrapAsyncController(
    container.get<ILearnerCourseController>(TYPES.ILearnerCourseController),
  );

  const learnerProfessionalsController = wrapAsyncController(
    container.get<ILearnerProfessionalProfileController>(
      TYPES.ILearnerProfessionalProfileController,
    ),
  );

  const availabilityController = wrapAsyncController(
    container.get<IAvailabilityController>(TYPES.IAvailabilityController),
  );

  router.use("/home", learnerHomeRoute(learnerHomeController));
  router.use("/profile", learnerProfileRoute(learnerProfileController));
  router.use("/course", learnerCourseRoutes(learnerCourseController));
  router.use("/professionals", learnerProfessionalProfileRoutes(learnerProfessionalsController));
  router.use("/availability", learnerAvailabilityRoutes(availabilityController));

  return router;
}
