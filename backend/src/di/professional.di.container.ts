import { IProfessionalProfileController } from "@/interface/professional/IProfessionalProfileController";
import { ProfessionalDashboardDtoMapper } from "@/schema/professional/dashboard.dtos.mapper";
import { IProfessionalDashboardController } from "@/interface/professional/IProfessionalDashboardController";
import { IProfessionalDashboardDtoMap } from "@/interface/professional/IProfessionalDasboardDtoMap";
import { IProfessionalDashboardService } from "@/interface/professional/IProfessionalDashboard";
import { ProfessionalDashboardService } from "@/services/professional/professional.dashboard.service";
import { IProfessionalProfileService } from "@/interface/professional/IProfessionalProfileService";
import { ProfessionalProfileService } from "@/services/professional/profesional.profile.service";
import { ProfessionalProfileController } from "@/controllers/professional/profesional.profile.controller";
import ProfessionalProfile, {
  IProfessionalProfile,
} from "@/model/professional/profesional.profile";
import { IProfessionalProfileRepo } from "@/interface/professional/IProfessionalProfileRepo";
import { ProfessionalProfileRepo } from "@/repos/professional/professional.profile.repo";
import { TYPES } from "@/types/shared/inversify/types";
import { Model } from "mongoose";
import { ProfessionalDashboardController } from "@/controllers/professional/professional.dashboard.controller";
import { Container } from "inversify";

export const registerProfessional = (container: Container): void => {
  container
    .bind<Model<IProfessionalProfile>>(TYPES.IProfessionalProfileModel)
    .toConstantValue(ProfessionalProfile);

  container
    .bind<IProfessionalProfileRepo>(TYPES.IProfessionalProfileRepo)
    .to(ProfessionalProfileRepo);

  container
    .bind<IProfessionalProfileService>(TYPES.IProfessionalProfileService)
    .to(ProfessionalProfileService);

  container
    .bind<IProfessionalProfileController>(TYPES.IProfessionalProfileController)
    .to(ProfessionalProfileController);

  container
    .bind<IProfessionalDashboardService>(TYPES.IProfessionalDashboardService)
    .to(ProfessionalDashboardService);

  container
    .bind<IProfessionalDashboardDtoMap>(TYPES.IProfessionalDashboardDtoMap)
    .to(ProfessionalDashboardDtoMapper);

  container
    .bind<IProfessionalDashboardController>(TYPES.IProfessionalDashboardController)
    .to(ProfessionalDashboardController);
};
