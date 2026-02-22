import { IProfessionalProfileController } from "@/interface/professional/professional.profile.controller.interface";
import { ProfessionalDashboardDtoMapper } from "@/schema/professional/dashboard.dtos.mapper";
import { IProfessionalDashboardController } from "@/interface/professional/professional.dashboard.controller.interface";
import { IProfessionalDashboardDtoMap } from "@/interface/professional/professional.dto.mapper.interface";
import { IProfessionalDashboardService } from "@/interface/professional/professional.dashboard.service.interface";
import { ProfessionalDashboardService } from "@/services/professional/professional.dashboard.service";
import { IProfessionalProfileService } from "@/interface/professional/professional.profile.service.interface";
import { ProfessionalProfileService } from "@/services/professional/profesional.profile.service";
import { ProfessionalProfileController } from "@/controllers/professional/profesional.profile.controller";
import ProfessionalProfile, {
  IProfessionalProfile,
} from "@/model/professional/professional.profile";
import { IProfessionalProfileRepo } from "@/interface/professional/professional.profile.repo.interface";
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
