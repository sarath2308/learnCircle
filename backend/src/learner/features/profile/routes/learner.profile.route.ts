import { Router } from "express";
import { multerMiddleware } from "../../../../common/middleware/multer.middleware";
import { ILearnerProfileController } from "../interface/ILearnerProfileController";
import { LearnerProfileSchemas } from "../dtos/schemas/profile.request.dto";
import { zodValidation } from "@/common/middleware";
export function learnerProfileRoute(controller: ILearnerProfileController) {
  const router = Router();
  router.get(
    "/",
    zodValidation(LearnerProfileSchemas.getProfile),
    controller.getProfile.bind(controller),
  );
  router.patch(
    "/avatar",
    zodValidation(LearnerProfileSchemas.updateProfilePhoto),
    multerMiddleware,
    controller.updateProfilePhoto.bind(controller),
  );
  router.post(
    "/update-email/request-otp",
    zodValidation(LearnerProfileSchemas.requestEmailChangeOtp),
    controller.requestEmailChangeOtp.bind(controller),
  );
  router.post(
    "/update-email/resend-otp",
    zodValidation(LearnerProfileSchemas.resendEmailChangeOtp),
    controller.resendEmailChangeOtp.bind(controller),
  );
  router.post(
    "/update-email/verify-otp",
    zodValidation(LearnerProfileSchemas.verifyEmailChangeOtp),
    controller.verifyEmailChangeOtp.bind(controller),
  );
  router.post(
    "/update-password",
    zodValidation(LearnerProfileSchemas.updatePassword),
    controller.updatePassword.bind(controller),
  );
  router.post(
    "/update-username",
    zodValidation(LearnerProfileSchemas.updateName),
    controller.updateName.bind(controller),
  );
  // router.post("/")
  return router;
}
