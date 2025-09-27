import { Router } from "express";
import { LearnerHomeController } from "../../controllers/learner/learner.home.controller";
export function learnerHomeRoute(controller: LearnerHomeController) {
  const router = Router();
  router.get("/", controller.getHome.bind(controller));
  return router;
}
