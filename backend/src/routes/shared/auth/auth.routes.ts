import { Router } from "express";
import { validateRequest } from "@/middleware/zodValidation.middlevare";
import { IAuthController } from "@/interface/shared/auth/auth.controller.interface";
import {
  ForgotPasswordSchema,
  GoogleLoginSchema,
  LoginRequestSchema,
  ResendForgotOtpSchema,
  ResendSignupOtpSchema,
  ResetPasswordSchema,
  SignupRequestSchema,
  VerifyForgotOtpSchema,
  VerifySignupOtpSchema,
} from "@/schema/shared/auth/auth.dto.schema";

export function authRoutes(controller: IAuthController) {
  const router = Router();

  router.post(
    "/request-signup",
    validateRequest(SignupRequestSchema),
    controller.reqSignup.bind(controller),
  );

  router.post(
    "/signup",
    validateRequest(VerifySignupOtpSchema),
    controller.verifyAndSignup.bind(controller),
  );

  router.post(
    "/signup/resend-otp",
    validateRequest(ResendSignupOtpSchema),
    controller.resendSignupOtp.bind(controller),
  );

  router.post("/login", validateRequest(LoginRequestSchema), controller.login.bind(controller));

  router.post(
    "/forgot",
    validateRequest(ForgotPasswordSchema),
    controller.forgotPassword.bind(controller),
  );

  router.post(
    "/forgot/verify-otp",
    validateRequest(VerifyForgotOtpSchema),
    controller.verifyForgotOtp.bind(controller),
  );

  router.post(
    "/forgot/resend-otp",
    validateRequest(ResendForgotOtpSchema),
    controller.resendForgotOtp.bind(controller),
  );

  router.put(
    "/reset-password",
    validateRequest(ResetPasswordSchema),
    controller.resetPassword.bind(controller),
  );

  router.post(
    "/google",
    validateRequest(GoogleLoginSchema),
    controller.googleSign.bind(controller),
  );
  router.post("/logout", controller.logout.bind(controller));

  return router;
}
