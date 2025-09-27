import { Container } from "inversify";
import "reflect-metadata";

// import interfaces and classes
import { LearnerRepo } from "../../Repositories/learner/learnerRepo";
import { Learner } from "../../models/Learner";
import { TokenService } from "../..//utils/token.jwt";
import { EmailService } from "../../utils/emailService";
import { GenerateOtp } from "../../utils/otp.utils.";
import { PasswordService } from "../../utils/passwordService";
import { RedisRepository } from "../../Repositories/redisRepo";
import redisClient from "../../config/redis/redis";
import { LearnerAuthController } from "../../controllers/learner/learner.auth.controller";
import { ProfesionalRepo } from "../../Repositories/profesional/profesionalRepo";
import Professional from "../../models/profesionals";
import { RefreshController } from "../../controllers/refreshController";
import { RefreshService } from "../../services/refresh.service";
import { ProfesionalAuthController } from "../../controllers/profesional/profesional.auth.controller";
import { LearnerAuthService } from "../../services/learner/learnerAuthService";
import { ProfesionalAuthService } from "../../services/profesional/profesionalAuthService";
import { Model } from "mongoose";
import { ILearner } from "../../models/Learner";
import { IProfessional } from "../../models/profesionals";
import { TYPES } from "../../types/types";
import { LearnerHomeController } from "../../controllers/learner/learner.home.controller";
import { LearnerHomeService } from "../../services/learner/learner.home.service.ts";
import { LearnerProfileService } from "../../services/learner/learner.profile.service";
import { LearnerProfileController } from "../../controllers/learner/learner.profile.controller";
import { CloudinaryService } from "../../utils/cloudinary.service";
import { RoleDtoMapper } from "../../dtos/mapper/dtos.mapper";
export const container = new Container();

// Bindings
container.bind<Model<ILearner>>(TYPES.LearnerModel).toConstantValue(Learner);
container.bind<Model<IProfessional>>(TYPES.ProfesionalModel).toConstantValue(Professional);
container
  .bind<LearnerRepo>(TYPES.LearnerRepo)
  .toDynamicValue(() => new LearnerRepo(container.get(TYPES.LearnerModel)));
container
  .bind<ProfesionalRepo>(TYPES.ProfesionalRepo)
  .toDynamicValue(() => new ProfesionalRepo(container.get(TYPES.ProfesionalModel)));

container.bind(TYPES.TokenService).to(TokenService).inSingletonScope();
container.bind(TYPES.EmailService).to(EmailService).inSingletonScope();
container.bind(TYPES.GenerateOtp).to(GenerateOtp).inSingletonScope();
container.bind(TYPES.PasswordService).to(PasswordService).inSingletonScope();
container.bind(TYPES.CloudinaryService).to(CloudinaryService).inSingletonScope();
container.bind(TYPES.RoleDtoMapper).to(RoleDtoMapper).inSingletonScope();
container.bind(TYPES.RedisRepository).toConstantValue(new RedisRepository<any>(redisClient));

//learner auth service
container.bind(TYPES.LearnerAuthService).toDynamicValue(() => {
  return new LearnerAuthService(
    container.get(TYPES.LearnerRepo),
    container.get(TYPES.EmailService),
    container.get(TYPES.GenerateOtp),
    container.get(TYPES.TokenService),
    container.get(TYPES.RedisRepository),
    container.get(TYPES.PasswordService),
    container.get(TYPES.CloudinaryService),
    container.get(TYPES.RoleDtoMapper),
  );
});

container.bind(TYPES.LearnerHomeService).toDynamicValue(() => {
  return new LearnerHomeService(container.get(TYPES.LearnerRepo));
});

//learner profile
container.bind(TYPES.LearnerProfileService).toDynamicValue(() => {
  return new LearnerProfileService(
    container.get(TYPES.LearnerRepo),
    container.get(TYPES.EmailService),
    container.get(TYPES.GenerateOtp),
    container.get(TYPES.RedisRepository),
    container.get(TYPES.PasswordService),
    container.get(TYPES.CloudinaryService),
  );
});
//profesional-auth service
container.bind(TYPES.ProfesionalAuthService).toDynamicValue(() => {
  return new ProfesionalAuthService(
    container.get(TYPES.ProfesionalRepo),
    container.get(TYPES.EmailService),
    container.get(TYPES.GenerateOtp),
    container.get(TYPES.TokenService),
    container.get(TYPES.RedisRepository),
    container.get(TYPES.PasswordService),
    container.get(TYPES.CloudinaryService),
    container.get(TYPES.RoleDtoMapper),
  );
});

//refresh service
container.bind(TYPES.RefreshService).toDynamicValue(() => {
  return new RefreshService(container.get(TYPES.TokenService));
});
// learner-Auth-Controller
container.bind(TYPES.LearnerAuthController).toDynamicValue(() => {
  return new LearnerAuthController(container.get(TYPES.LearnerAuthService));
});

container.bind(TYPES.LearnerHomeController).toDynamicValue(() => {
  return new LearnerHomeController(container.get(TYPES.LearnerHomeService));
});

container.bind(TYPES.LearnerProfileController).toDynamicValue(() => {
  return new LearnerProfileController(container.get(TYPES.LearnerProfileService));
});

container.bind(TYPES.ProfesionalAuthController).toDynamicValue(() => {
  return new ProfesionalAuthController(container.get(TYPES.ProfesionalAuthService));
});

container.bind(TYPES.RefreshController).toDynamicValue(() => {
  return new RefreshController(container.get(TYPES.RefreshService));
});
export default container;
