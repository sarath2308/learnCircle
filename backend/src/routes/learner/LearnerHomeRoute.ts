import { Router } from "express";
import { LearnerHomeController } from "../../controllers/learner/learner.home.controller";
const router = Router();
export function learnerHomeRoute(controller: LearnerHomeController) {
  router.get("");
}

export default router;
