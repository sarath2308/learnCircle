import { authorizeRoles } from "@/middleware";
import { authEntryRoute } from "./shared/auth/auth.entry.route";
import { learnerEntryRoute } from "./learner/learner.entry.route";
import { professionalEntryRoute } from "./professional/professional.entry.route";
import { adminEntryRoute } from "./admin/admin.entry.route";
import { courseEntryRoute } from "./shared/course/course.entry.routes";
import container from "@/di/di.container";
import { IAuthenticateMiddleware } from "@/interface/shared/auth/IAuthenticateMiddleware";
import { TYPES } from "@/types/shared/inversify/types";
import { Router } from "express";
import { ROLE } from "@/constants/shared/Role";

export function entryRoute() {
  const authenticate = container.get<IAuthenticateMiddleware>(TYPES.IAuthenticateMiddleware);
  const router = Router();

  router.use("/api/auth", authEntryRoute());

  router.use(
    "/api/learner",
    authenticate.handle.bind(authenticate),
    authorizeRoles(ROLE.LEARNER),
    learnerEntryRoute(),
  );

  router.use(
    "/api/professional",
    authenticate.handle.bind(authenticate),
    authorizeRoles(ROLE.PROFESSIONAL),
    professionalEntryRoute(),
  );

  router.use(
    "/api/admin",
    authenticate.handle.bind(authenticate),
    authorizeRoles(ROLE.ADMIN),
    adminEntryRoute(),
  );

  router.use(
    "/api/course",
    authenticate.handle.bind(authenticate),
    authorizeRoles(ROLE.ADMIN, ROLE.PROFESSIONAL),
    courseEntryRoute(),
  );
  return router;
}
