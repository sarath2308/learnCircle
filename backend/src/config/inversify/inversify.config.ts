import { Container } from "inversify";
import "reflect-metadata";

// import interfaces and classes
import {
  AuthController,
  EmailAuthService,
  GoogleAuthProvider,
  IAuthController,
  IAuthProviderService,
  IUser,
  OtpService,
  TokenService,
  User,
} from "@/common";
import { EmailService } from "@/common";
import { PasswordService } from "@/common";
import { RedisRepository } from "../../common/Repo/redisRepo";
import redisClient from "../../config/redis/redis";
import { RefreshController } from "@/common";
import { RefreshTokenService } from "@/common";
import { Model } from "mongoose";
import { TYPES } from "../../common/types/inversify/types";
import { LearnerHomeController } from "@/learner";
import { LearnerProfileController } from "@/learner";
import { CloudinaryService } from "@/common";
import { ProfesionalVerificationController } from "@/professionals";
import { RepositoryFactory } from "@/common/services/roleRepoFatcory.service";
import { IUserRepo, UserRepo } from "@/common";
import { UserDtoMapper } from "@/common/dtos/mapper/user.map";
import { PendingSignup } from "@/common/models/pendingUser.model";
import { IPendingSignupRepo, PendingSignupRepo } from "@/common/Repo/pendingSignup.repo";
import { AuthOrchestrator, IAuthOrchestrator } from "@/common/services/auth.orchestrator";
export const container = new Container();

// Bindings
container.bind<Model<IUser>>(TYPES.IUserModel).toConstantValue(User);
// container.bind<Model<IProfessional>>(TYPES.ProfesionalModel).toConstantValue(Professional);
// container.bind<Model<IAdmin>>(TYPES.AdminModel).toConstantValue(Admin);
container.bind<IUserRepo>(TYPES.IUserRepo).to(UserRepo);
container.bind<IPendingSignupRepo>(TYPES.IPendingSignupRepo).to(PendingSignupRepo);
// container
//   .bind<ILearnerRepo>(TYPES.User)
//   .toDynamicValue(() => new LearnerRepo(container.get(TYPES.LearnerModel)));
// container
//   .bind<IProfessionalRepo>(TYPES.ProfesionalRepo)
//   .toDynamicValue(() => new ProfesionalRepo(container.get(TYPES.ProfesionalModel)));
// container
//   .bind<AdminRepo>(TYPES.AdminRepository)
//   .toDynamicValue(() => new AdminRepo(container.get(TYPES.AdminModel)));

container.bind(TYPES.ITokenService).to(TokenService).inSingletonScope();
container.bind(TYPES.IEmailService).to(EmailService).inSingletonScope();
container.bind(TYPES.IOtpService).to(OtpService).inSingletonScope();
container.bind(TYPES.IPasswordService).to(PasswordService).inSingletonScope();
container.bind(TYPES.ICloudinaryService).to(CloudinaryService).inSingletonScope();
container.bind(TYPES.IEmailAuthService).to(EmailAuthService).inSingletonScope();
container.bind(TYPES.IRoleRepoFactory).to(RepositoryFactory).inSingletonScope();
container.bind(TYPES.IRedisRepository).toConstantValue(new RedisRepository(redisClient));
container.bind(TYPES.IUserDtoMapper).to(UserDtoMapper).inSingletonScope();
container.bind(TYPES.IPendingSignup).to(PendingSignup);
container.bind<IAuthProviderService>(TYPES.IProviderAuth).to(GoogleAuthProvider);
container.bind<IAuthOrchestrator>(TYPES.IAuthOrchestrator).to(AuthOrchestrator);
container.bind<IAuthController>(TYPES.IAuthController).to(AuthController);
//learner auth service
// container.bind(TYPES.LearnerAuthService).toDynamicValue(() => {
//   return new LearnerAuthService(

//   );
// });

// container.bind(TYPES.ILearnerHomeService).toDynamicValue(() => {
//   return new LearnerHomeService(container.get(TYPES.ILearnerRepo));
// });

//learner profile
// container.bind(TYPES.ILearnerProfileService).toDynamicValue(() => {
//   return new LearnerProfileService(
//     container.get(TYPES.LearnerRepo),
//     container.get(TYPES.EmailService),
//     container.get(TYPES.GenerateOtp),
//     container.get(TYPES.RedisRepository),
//     container.get(TYPES.PasswordService),
//     container.get(TYPES.CloudinaryService),
//   );
// });
//profesional-auth service

// container.bind(TYPES.IProfesionalVerificationService).toDynamicValue(() => {
//   return new ProfesionalVerificationService(
//     container.get(TYPES.ProfesionalRepo),
//     container.get(TYPES.CloudinaryService),
//   );
// });

//refresh service
container.bind(TYPES.IRefreshService).toDynamicValue(() => {
  return new RefreshTokenService(
    container.get(TYPES.ITokenService),
    container.get(TYPES.IRedisRepository),
  );
});

container.bind(TYPES.ILearnerHomeController).toDynamicValue(() => {
  return new LearnerHomeController(container.get(TYPES.ILearnerHomeService));
});

container.bind(TYPES.ILearnerProfileController).toDynamicValue(() => {
  return new LearnerProfileController(container.get(TYPES.ILearnerProfileService));
});

container.bind(TYPES.IProfesionalVerificationController).toDynamicValue(() => {
  return new ProfesionalVerificationController(
    container.get(TYPES.IProfesionalVerificationService),
  );
});

container.bind(TYPES.IRefreshController).toDynamicValue(() => {
  return new RefreshController(container.get(TYPES.IRefreshService));
});

export default container;
