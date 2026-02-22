import { Router } from "express";
import { ILearnerHomeController } from "@/interface/learner/learner.home.controller.interface";
export function learnerHomeRoute(controller: ILearnerHomeController) {
  const router = Router();
  router.get("/", controller.getHome.bind(controller));
  return router;
}
