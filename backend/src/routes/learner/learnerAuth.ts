import { Router } from "express";
import { IAuthController } from "../../types/common/learnerAuthController";


export function learnerAuthRoutes(controller:IAuthController) {
  const router = Router();

  router.post("/signup", controller.signup);
  router.post('/login',controller.login)
  router.post('/forgotPassword',controller.forgotPassword)
  router.post("/reset",controller.resetPassword)
  router.post('/logout',controller.logout)  
  

  router.get('/refresh',controller.refreshToken)




  return router;
}
