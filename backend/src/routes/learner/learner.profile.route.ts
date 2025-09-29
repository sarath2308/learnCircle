import { Router } from "express";
import { LearnerProfileController } from "../../controllers/learner/learner.profile.controller";
import { multerMiddleware } from "../../middleware/multer.middleware";

export function learnerProfileRoute(controller: LearnerProfileController) {
  const router = Router();
  router.get("/", controller.getProfile.bind(controller));
  router.patch("/avatar", multerMiddleware, controller.uploadProfilePhoto.bind(controller));
  router.patch("/", controller.updateProfile.bind(controller));
  // router.post("/")
  return router;
}
