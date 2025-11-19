import { Router } from "express";
import { busboyUpload } from "../../middleware/multiFileUpload.middleware";
import { ILearnerProfileController } from "../../interface/learner/ILearnerProfileController";
import { LearnerProfileSchemas } from "../../schema/learner/profile.request.dto";
import { validateRequest } from "@/middleware/zodValidation.middlevare";
import { PROFILE_ROUTES } from "../../constants/learner/learner.profile.route.constant";
export function learnerProfileRoute(controller: ILearnerProfileController) {
  const router = Router();
  router.get(PROFILE_ROUTES.DEFAULT, controller.getProfile.bind(controller));

  router.get(PROFILE_ROUTES.GET_PROFILE_URL, controller.getNewProfileUrl.bind(controller));

  router.patch(
    PROFILE_ROUTES.UPDATE_AVATAR,
    validateRequest(LearnerProfileSchemas.updateProfilePhoto),
    busboyUpload,
    controller.updateProfilePhoto.bind(controller),
  );

  router.post(
    PROFILE_ROUTES.EMAIL_REQUEST_OTP,
    validateRequest(LearnerProfileSchemas.requestEmailChangeOtp),
    controller.requestEmailChangeOtp.bind(controller),
  );

  router.post(PROFILE_ROUTES.EMAIL_RESEND_OTP, controller.resendEmailChangeOtp.bind(controller));

  router.post(
    PROFILE_ROUTES.EMAIL_VERIFY_OTP,
    validateRequest(LearnerProfileSchemas.verifyEmailChangeOtp),
    controller.verifyEmailChangeOtp.bind(controller),
  );

  router.patch(
    PROFILE_ROUTES.UPDATE_PASSWORD,
    validateRequest(LearnerProfileSchemas.updatePassword),
    controller.updatePassword.bind(controller),
  );

  router.patch(
    PROFILE_ROUTES.UPDATE_USERNAME,
    validateRequest(LearnerProfileSchemas.updateName),
    controller.updateName.bind(controller),
  );
  // router.post("/")
  return router;
}
