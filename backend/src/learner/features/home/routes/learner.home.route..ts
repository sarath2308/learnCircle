import { Router } from "express";
import { LearnerHomeController } from "@/learner";
export function learnerHomeRoute(controller: LearnerHomeController) {
  const router = Router();
  router.get("/", controller.getHome.bind(controller));
  return router;
}
