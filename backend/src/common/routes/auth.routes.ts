import { Router } from "express";
import {
  ForgotPasswordSchema,
  GoogleLoginSchema,
  IAuthController,
  LoginRequestSchema,
  ResendForgotOtpSchema,
  ResendSignupOtpSchema,
  ResetPasswordSchema,
  SignupRequestSchema,
  VerifyForgotOtpSchema,
  VerifySignupOtpSchema,
} from "@/common";
import { zodValidation } from "../middleware";

export function authRoutes(controller: IAuthController) {
  const router = Router();

  router.post(
    "/request-signup",
    zodValidation(SignupRequestSchema),
    controller.reqSignup.bind(controller),
  );

  router.post(
    "/signup",
    zodValidation(VerifySignupOtpSchema),
    controller.verifyAndSignup.bind(controller),
  );

  router.post(
    "/signup/resend-otp",
    zodValidation(ResendSignupOtpSchema),
    controller.resendSignupOtp.bind(controller),
  );

  router.post("/login", zodValidation(LoginRequestSchema), controller.login.bind(controller));

  router.post(
    "/forgot",
    zodValidation(ForgotPasswordSchema),
    controller.forgotPassword.bind(controller),
  );

  router.post(
    "/forgot/verify-otp",
    zodValidation(VerifyForgotOtpSchema),
    controller.verifyForgotOtp.bind(controller),
  );

  router.post(
    "/forgot/resend-otp",
    zodValidation(ResendForgotOtpSchema),
    controller.resendForgotOtp.bind(controller),
  );

  router.put(
    "/reset-password",
    zodValidation(ResetPasswordSchema),
    controller.resetPassword.bind(controller),
  );

  router.post("/google", zodValidation(GoogleLoginSchema), controller.googleSign.bind(controller));
  // router.post('/logout',controller.logout)

  return router;
}
