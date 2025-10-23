import { Router } from "express";
import { multerMiddleware } from "../../../../common/middleware/multer.middleware";
import { ILearnerProfileController } from "../interface/ILearnerProfileController";

export function learnerProfileRoute(controller: ILearnerProfileController) {
  const router = Router();
  router.get("/", controller.getProfile.bind(controller));
  router.patch("/avatar", multerMiddleware, controller.uploadProfilePhoto.bind(controller));
  router.patch("/", controller.updateProfile.bind(controller));
  router.post("/update-email/request-otp");
  router.post("/update-email/resend-otp");
  router.post("/update-email/verify-otp");
  router.post("/update-password");
  router.post("/update-username");
  // router.post("/")
  return router;
}
