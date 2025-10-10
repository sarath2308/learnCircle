import { Container } from "inversify";
import "reflect-metadata";

// import interfaces and classes
import { ILearnerRepo, LearnerRepo } from "@/learner";
import { Learner } from "@/learner";
import { EmailAuthService, IRepoRole, IUser, OtpService, TokenService, User } from "@/common";
import { EmailService } from "@/common";
import { GenerateOtp } from "@/common";
import { PasswordService } from "@/common";
import { RedisRepository } from "../../common/Repo/redisRepo";
import redisClient from "../../config/redis/redis";
import { LearnerAuthController } from "@/learner";
import { IProfessionalRepo, ProfesionalRepo } from "@/professionals";
import Professional from "../../professionals/models/profesionals";
import { RefreshController } from "@/common";
import { RefreshTokenService } from "@/common";
import { ProfesionalAuthController } from "@/professionals";
import { LearnerAuthService } from "@/learner";
import { ProfesionalAuthService } from "@/professionals";
import { Model } from "mongoose";
import { ILearner } from "../../learner/models/Learner";
import { IProfessional } from "../../professionals/models/profesionals";
import { TYPES } from "../../common/types/inversify/types";
import { LearnerHomeController } from "@/learner";
import { LearnerHomeService } from "@/learner";
import { LearnerProfileService } from "../../learner/features/profile/service/learner.profile.service";
import { LearnerProfileController } from "@/learner";
import { CloudinaryService } from "@/common";
import { RoleDtoMapper } from "../../dtos/mapper/dtos.mapper";
import { ProfesionalVerificationService } from "@/professionals";
import { ProfesionalVerificationController } from "@/professionals";
import { Admin, IAdmin } from "../../admin/models/Admin";
import { AdminRepo } from "@/admin";
import { AdminAuthService } from "@/admin";
import { AdminAuthController } from "@/admin";
import { RepositoryFactory } from "@/common/services/roleRepoFatcory.service";
import { IUserRepo, UserRepo } from "@/common";
export const container = new Container();

// Bindings
container.bind<Model<IUser>>(TYPES.UserModel).toConstantValue(User);
// container.bind<Model<IProfessional>>(TYPES.ProfesionalModel).toConstantValue(Professional);
// container.bind<Model<IAdmin>>(TYPES.AdminModel).toConstantValue(Admin);
container.bind<IUserRepo>(TYPES.IUserRepo).to(UserRepo);

// container
//   .bind<ILearnerRepo>(TYPES.User)
//   .toDynamicValue(() => new LearnerRepo(container.get(TYPES.LearnerModel)));
// container
//   .bind<IProfessionalRepo>(TYPES.ProfesionalRepo)
//   .toDynamicValue(() => new ProfesionalRepo(container.get(TYPES.ProfesionalModel)));
// container
//   .bind<AdminRepo>(TYPES.AdminRepository)
//   .toDynamicValue(() => new AdminRepo(container.get(TYPES.AdminModel)));

container.bind(TYPES.TokenService).to(TokenService).inSingletonScope();
container.bind(TYPES.EmailService).to(EmailService).inSingletonScope();
container.bind(TYPES.OtpService).to(OtpService).inSingletonScope();
container.bind(TYPES.PasswordService).to(PasswordService).inSingletonScope();
container.bind(TYPES.CloudinaryService).to(CloudinaryService).inSingletonScope();
container.bind(TYPES.RoleDtoMapper).to(RoleDtoMapper).inSingletonScope();
container.bind(TYPES.IEmailAuthService).to(EmailAuthService).inSingletonScope();
container.bind(TYPES.IRoleRepoFactory).to(RepositoryFactory).inSingletonScope();
container.bind(TYPES.RedisRepository).toConstantValue(new RedisRepository<any>(redisClient));

//learner auth service
// container.bind(TYPES.LearnerAuthService).toDynamicValue(() => {
//   return new LearnerAuthService(

//   );
// });

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

container.bind(TYPES.ProfesionalVerificationService).toDynamicValue(() => {
  return new ProfesionalVerificationService(
    container.get(TYPES.ProfesionalRepo),
    container.get(TYPES.CloudinaryService),
  );
});

container.bind(TYPES.AdminAuthService).toDynamicValue(() => {
  return new AdminAuthService(
    container.get(TYPES.AdminRepository),
    container.get(TYPES.TokenService),
  );
});

//refresh service
container.bind(TYPES.RefreshService).toDynamicValue(() => {
  return new RefreshTokenService(
    container.get(TYPES.TokenService),
    container.get(TYPES.RedisRepository),
  );
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

container.bind(TYPES.ProfesionalVerificationController).toDynamicValue(() => {
  return new ProfesionalVerificationController(container.get(TYPES.ProfesionalVerificationService));
});

container.bind(TYPES.RefreshController).toDynamicValue(() => {
  return new RefreshController(container.get(TYPES.RefreshService));
});

container.bind(TYPES.AdminAuthController).toDynamicValue(() => {
  return new AdminAuthController(container.get(TYPES.AdminAuthService));
});
export default container;
