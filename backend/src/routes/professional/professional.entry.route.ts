import { Router } from "express";
import container from "@/di/di.container";
import { TYPES } from "@/types/shared/inversify/types";
import { professionalDashboardRoutes } from "./professional.dashboard";
import { professionalProfileRoutes } from "./professional.profile.routes";
import { IProfessionalDashboardController } from "@/interface/professional/professional.dashboard.controller.interface";
import { IProfessionalProfileController } from "@/interface/professional/professional.profile.controller.interface";
import { wrapAsyncController } from "@/utils/wrapAsyncClass";
import { porfessionalSessionRoutes } from "./professional.session.routes";
import { ISessionBookingController } from "@/interface/shared/session-booking/booking/session.booking.controller";

export function professionalEntryRoute() {
  const router = Router();

  const professionalProfileController = wrapAsyncController(
    container.get<IProfessionalProfileController>(TYPES.IProfessionalProfileController),
  );
  const professionalDashboardController = wrapAsyncController(
    container.get<IProfessionalDashboardController>(TYPES.IProfessionalDashboardController),
  );

  const professionalSessionController = wrapAsyncController(
    container.get<ISessionBookingController>(TYPES.ISessionBookingController),
  );
  router.use("/dashboard", professionalDashboardRoutes(professionalDashboardController));
  router.use("/profile", professionalProfileRoutes(professionalProfileController));
  router.use("/sessions-bookings", porfessionalSessionRoutes(professionalSessionController));

  return router;
}
