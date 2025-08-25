import { Router } from "express";
import { IAuthController } from "../../types/common/learnerAuthController";


export function learnerAuthRoutes(controller:IAuthController) {
  const router = Router();

  router.post("/signup", controller.signup.bind(controller));
  router.post('/verify-otp',controller.verifyOtp.bind(controller))
  router.post('/login',controller.login.bind(controller))
  router.post('/forgotPassword',controller.forgotPassword.bind(controller))
  // router.post("/reset",controller.resetPassword)
  // router.post('/logout',controller.logout)  
  

  // router.get('/refresh',controller.refreshToken)




  return router;
}
