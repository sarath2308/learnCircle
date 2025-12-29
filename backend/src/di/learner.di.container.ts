import { ILearnerProfileController } from "@/interface/learner/ILearnerProfileController";
import { ILearnerHomeService } from "@/interface/learner/ILearnerHomeService";
import { ILearnerHomeController } from "@/interface/learner/learner.home.controller.interface";
import { LearnerProfileMapperService } from "@/mapper/learner/learnerProfile.dto.mapper";
import { ILearnerProfile, LearnerProfile } from "@/model/learner/learner.profile.model";
import { LearnerProfileRepo } from "@/repos/learner/learner.profile.repo";
import { ILearnerProfileRepo } from "@/interface/learner/learner.profile.repo.interface";
import { ILearnerProfileService } from "@/interface/learner/learner.profile.service.interface";
import { LearnerProfileService } from "@/services/learner/learner.profile.service";
import { LearnerProfileController } from "@/controllers/learner/learner.profile.controller";
import { LearnerHomeService } from "@/services/learner/learner.home.service";
import { LearnerHomeController } from "@/controllers/learner/learner.home.controller";
import { ILearnerProfileMapperService } from "@/interface/learner/learner.profile.mapper.interface";
import { TYPES } from "@/types/shared/inversify/types";
import { Model } from "mongoose";
import { Container } from "inversify";

export const registerLearner = (container: Container): void => {
  container
    .bind<Model<ILearnerProfile>>(TYPES.ILearnerProfileModel)
    .toConstantValue(LearnerProfile);
  container.bind<ILearnerProfileRepo>(TYPES.ILearnerProfileRepo).to(LearnerProfileRepo);
  container.bind<ILearnerProfileService>(TYPES.ILearnerProfileService).to(LearnerProfileService);
  container
    .bind<ILearnerProfileMapperService>(TYPES.ILearnerProfileDto)
    .to(LearnerProfileMapperService);
  container
    .bind<ILearnerProfileController>(TYPES.ILearnerProfileController)
    .to(LearnerProfileController);

  container.bind<ILearnerHomeService>(TYPES.ILearnerHomeService).to(LearnerHomeService);
  container.bind<ILearnerHomeController>(TYPES.ILearnerHomeController).to(LearnerHomeController);
};
