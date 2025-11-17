import container from "@/di/di.container";
import { Router } from "express";
import { ILearnerHomeController } from "@/interface/learner/ILearnerHomeController";
import { TYPES } from "@/types/shared/inversify/types";
import { ILearnerProfileController } from "@/interface/learner/ILearnerProfileController";
import { learnerHomeRoute } from "./learner.home.route.";
import { learnerProfileRoute } from "./learner.profile.route";

export function learnerEntryRoute() {
  const router = Router();
  const learnerHomeController = container.get<ILearnerHomeController>(TYPES.ILearnerHomeController);
  const learnerProfileController = container.get<ILearnerProfileController>(
    TYPES.ILearnerProfileController,
  );

  router.use("/home", learnerHomeRoute(learnerHomeController));
  router.use("/profile", learnerProfileRoute(learnerProfileController));

  return router;
}
