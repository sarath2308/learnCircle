import { Router } from "express";
import { LearnerProfileController } from "@/learner";
import { multerMiddleware } from "../../../../common/middleware/multer.middleware";

export function learnerProfileRoute(controller: LearnerProfileController) {
  const router = Router();
  router.get("/", controller.getProfile.bind(controller));
  router.patch("/avatar", multerMiddleware, controller.uploadProfilePhoto.bind(controller));
  router.patch("/", controller.updateProfile.bind(controller));
  // router.post("/")
  return router;
}
