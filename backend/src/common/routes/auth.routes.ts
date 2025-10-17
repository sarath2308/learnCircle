import { Router } from "express";
import { IAuthController } from "@/common";

export function authRoutes(controller: IAuthController) {
  const router = Router();

  router.post("/request-signup", controller.reqSignup.bind(controller));
  router.post("/signup", controller.verifyAndSignup.bind(controller));
  router.post("/signup/resend-otp", controller.resendSignupOtp.bind(controller));
  router.post("/login", controller.login.bind(controller));
  router.post("/forgot", controller.forgotPassword.bind(controller));
  router.post("/forgot/verify-otp", controller.verifyForgotOtp.bind(controller));
  router.post("/forgot/resend-otp", controller.resendForgotOtp.bind(controller));
  router.put("/reset-password", controller.resetPassword.bind(controller));
  router.post("/google", controller.googleSign.bind(controller));
  // router.post('/logout',controller.logout)

  return router;
}
