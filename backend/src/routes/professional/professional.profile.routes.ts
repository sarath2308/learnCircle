import { Router } from "express";
import { busboyUpload } from "@/middleware";
import { validateRequest } from "@/middleware/zodValidation.middlevare";
import { IProfessionalProfileController } from "../../interface/professional/professional.profile.controller.interface";
import { ProfessionalProfileSchema } from "../../schema/professional/profile.request.schema";
import { ProfessionalProfileUpdateSchema } from "@/schema/professional/professional-profile/professiona.profile.update.schema";
import { ProfessionalProfileRequestEmailChangeSchema } from "@/schema/professional/professional-profile/professiona.request .email.change.schema";
import { ProfessionalProfileVerifyOtp } from "@/schema/professional/professional-profile/professiona.verifyotp.update.schema";
import { ProfessionalPasswordResetSchema } from "@/schema/professional/professional-profile/professional.profile.resetPassword.schema";
export function professionalProfileRoutes(controller: IProfessionalProfileController) {
  const router = Router();
  router.post(
    "/",
    busboyUpload,
    validateRequest(ProfessionalProfileSchema),
    controller.uploadProfile.bind(controller),
  );
  router.get("/", controller.getProfile.bind(controller));
  router.patch("/avatar", busboyUpload, controller.updateProfileImage.bind(controller));
  router.patch(
    "/",
    validateRequest(ProfessionalProfileUpdateSchema),
    controller.updateProfile.bind(controller),
  );
  router.post(
    "/change-email",
    validateRequest(ProfessionalProfileRequestEmailChangeSchema),
    controller.reqEmailOtp.bind(controller),
  );
  router.post(
    "/change-email/verify-otp",
    validateRequest(ProfessionalProfileVerifyOtp),
    controller.verifyAndUpdateEmail.bind(controller),
  );
  router.post(
    "/change-password",
    validateRequest(ProfessionalPasswordResetSchema),
    controller.updatePassword.bind(controller),
  );
  router.post("/logout", controller.logOut.bind(controller));

  return router;
}
