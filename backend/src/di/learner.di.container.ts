import { ILearnerProfileController } from "@/interface/learner/learner.profile.controller.interface";
import { ILearnerHomeService } from "@/interface/learner/learner.home.service.interface";
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
import { ILearnerCourseService } from "@/interface/learner/learner.course.interface";
import { LearnerCourseService } from "@/services/learner/learner.course.service";
import { ILearnerCourseController } from "@/interface/learner/learner.course.controller.interface";
import { LearnerCourseController } from "@/controllers/learner/learner.course.controller";
import { ILearnerProfessionalProfileController } from "@/interface/learner/learner.professional.profile.controller";
import { LearnerProfessionalProfileController } from "@/controllers/learner/learner.professional.profiles.controller";

export const registerLearner = (container: Container): void => {
  //--------------------Model-----------------------------
  container
    .bind<Model<ILearnerProfile>>(TYPES.ILearnerProfileModel)
    .toConstantValue(LearnerProfile);

  //---------------Repo-------------------------------
  container.bind<ILearnerProfileRepo>(TYPES.ILearnerProfileRepo).to(LearnerProfileRepo);

  //-----------------Service------------------------------
  container.bind<ILearnerProfileService>(TYPES.ILearnerProfileService).to(LearnerProfileService);
  container.bind<ILearnerHomeService>(TYPES.ILearnerHomeService).to(LearnerHomeService);
  container
    .bind<ILearnerProfileMapperService>(TYPES.ILearnerProfileDto)
    .to(LearnerProfileMapperService);

  container.bind<ILearnerCourseService>(TYPES.ILearnerCourseService).to(LearnerCourseService);
  //-------------------Controller--------------------------
  container
    .bind<ILearnerProfileController>(TYPES.ILearnerProfileController)
    .to(LearnerProfileController);

  container
    .bind<ILearnerProfessionalProfileController>(TYPES.ILearnerProfessionalProfileController)
    .to(LearnerProfessionalProfileController);

  container.bind<ILearnerHomeController>(TYPES.ILearnerHomeController).to(LearnerHomeController);
  container
    .bind<ILearnerCourseController>(TYPES.ILearnerCourseController)
    .to(LearnerCourseController);
};
