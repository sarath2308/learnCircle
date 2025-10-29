import container from "@/config/inversify/inversify.config";
import { Router } from "express";
import { ILearnerHomeController } from "../features/home/interface/ILearnerHomeController";
import { TYPES } from "@/common/types/inversify/types";
import { ILearnerProfileController } from "../features/profile/interface/ILearnerProfileController";
import { learnerHomeRoute } from "../features/home";
import { learnerProfileRoute } from "../features/profile";

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
