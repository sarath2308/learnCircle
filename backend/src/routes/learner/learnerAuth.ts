import { Router } from "express";
import { IAuthController } from "../../types/common/learnerAuthController";

export function learnerAuthRoutes(controller: IAuthController) {
  const router = Router();

  router.post("/signup", controller.signup.bind(controller));
  router.post("/verify-otp", controller.verifyOtp.bind(controller));
  router.post("/login", controller.login.bind(controller));
  router.post("/forgotPassword", controller.forgotPassword.bind(controller));
  router.post("/get-otp", controller.getOtp.bind(controller));
  router.post("/resend-otp", controller.resendOtp.bind(controller));
  router.put("/reset-password", controller.resetPassword.bind(controller));
  router.post("/google", controller.googleSign.bind(controller));
  // router.post('/logout',controller.logout)

  // router.get('/refresh',controller.refreshToken)

  return router;
}
