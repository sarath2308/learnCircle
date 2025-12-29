import { authorizeRoles } from "@/middleware";
import { authEntryRoute } from "./shared/auth/auth.entry.route";
import { learnerEntryRoute } from "./learner/learner.entry.route";
import { professionalEntryRoute } from "./professional/professional.entry.route";
import { adminEntryRoute } from "./admin/admin.entry.route";
import { courseEntryRoute } from "./shared/course/course.entry.routes";
import container from "@/di/di.container";
import { IAuthenticateMiddleware } from "@/interface/shared/auth/authentication.middlware.interface";
import { TYPES } from "@/types/shared/inversify/types";
import { Router } from "express";
import { ROLE } from "@/constants/shared/Role";
import categoyRoutes from "./shared/category/category.routes";
import { wrapAsyncController } from "@/utils/wrapAsyncClass";
import { ICategoryController } from "@/interface/admin/category.controller.interface";

export function entryRoute() {
  const authenticate = container.get<IAuthenticateMiddleware>(TYPES.IAuthenticateMiddleware);
  const categoryController = wrapAsyncController(
    container.get<ICategoryController>(TYPES.ICategoryController),
  );

  const router = Router();

  router.use("/auth", authEntryRoute());

  router.use(
    "/learner",
    authenticate.handle.bind(authenticate),
    authorizeRoles(ROLE.LEARNER),
    learnerEntryRoute(),
  );

  router.use(
    "/professional",
    authenticate.handle.bind(authenticate),
    authorizeRoles(ROLE.PROFESSIONAL),
    professionalEntryRoute(),
  );

  router.use(
    "/admin",
    authenticate.handle.bind(authenticate),
    authorizeRoles(ROLE.ADMIN),
    adminEntryRoute(),
  );

  router.use(
    "/course",
    authenticate.handle.bind(authenticate),
    authorizeRoles(ROLE.ADMIN, ROLE.PROFESSIONAL),
    courseEntryRoute(),
  );

  router.use(
    "/category",
    authenticate.handle.bind(authenticate),
    authorizeRoles(ROLE.ADMIN, ROLE.PROFESSIONAL, ROLE.LEARNER),
    categoyRoutes(categoryController),
  );
  return router;
}
