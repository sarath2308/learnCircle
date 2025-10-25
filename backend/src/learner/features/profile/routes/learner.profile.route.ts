import { Router } from "express";
import { multerMiddleware } from "../../../../common/middleware/multer.middleware";
import { ILearnerProfileController } from "../interface/ILearnerProfileController";
import { LearnerProfileSchemas } from "../dtos/schemas/profile.request.dto";
import { zodValidation } from "@/common/middleware";
import { PROFILE_ROUTES } from "../routeConstant/route.constant";
export function learnerProfileRoute(controller: ILearnerProfileController) {
  const router = Router();
  router.get(PROFILE_ROUTES.DEFAULT, controller.getProfile.bind(controller));

  router.get(PROFILE_ROUTES.GET_PROFILE_URL, controller.getNewProfileUrl.bind(controller));

  router.patch(
    PROFILE_ROUTES.UPDATE_AVATAR,
    zodValidation(LearnerProfileSchemas.updateProfilePhoto),
    multerMiddleware,
    controller.updateProfilePhoto.bind(controller),
  );

  router.post(
    PROFILE_ROUTES.EMAIL_REQUEST_OTP,
    zodValidation(LearnerProfileSchemas.requestEmailChangeOtp),
    controller.requestEmailChangeOtp.bind(controller),
  );

  router.post(PROFILE_ROUTES.EMAIL_RESEND_OTP, controller.resendEmailChangeOtp.bind(controller));

  router.post(
    PROFILE_ROUTES.EMAIL_VERIFY_OTP,
    zodValidation(LearnerProfileSchemas.verifyEmailChangeOtp),
    controller.verifyEmailChangeOtp.bind(controller),
  );

  router.patch(
    PROFILE_ROUTES.UPDATE_PASSWORD,
    zodValidation(LearnerProfileSchemas.updatePassword),
    controller.updatePassword.bind(controller),
  );

  router.patch(
    PROFILE_ROUTES.UPDATE_USERNAME,
    zodValidation(LearnerProfileSchemas.updateName),
    controller.updateName.bind(controller),
  );
  // router.post("/")
  return router;
}
