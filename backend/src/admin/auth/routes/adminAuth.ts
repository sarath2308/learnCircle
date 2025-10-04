import { Router } from "express";
import { AdminAuthController } from "../../../controllers/admin/adminAuthController";

export function adminAuthRoutes(controller: AdminAuthController) {
  const router = Router();

  router.post("/login", controller.login.bind(controller));
  return router;
}
