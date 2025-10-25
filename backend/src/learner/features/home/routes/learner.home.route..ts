import { Router } from "express";
import { ILearnerHomeController } from "../interface/ILearnerHomeController";
export function learnerHomeRoute(controller: ILearnerHomeController) {
  const router = Router();
  router.get("/", controller.getHome.bind(controller));
  return router;
}
