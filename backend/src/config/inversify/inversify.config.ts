import { Container } from "inversify";
import "reflect-metadata";

// import interfaces and classes
import {
  IAuthController,
  IAuthProviderService,
  IPasswordResetService,
  IUser,
  OtpService,
  TokenService,
  User,
} from "@/common";
import { AuthController } from "@/common/controller";
import { EmailAuthService, PasswordResetService } from "@/common/services";
import { GoogleAuthProvider } from "@/common/services";
import { EmailService } from "@/common";
import { PasswordService } from "@/common";
import { RedisRepository } from "../../common/Repo/redisRepo";
import redisClient from "../../config/redis/redis";
import { RefreshController } from "@/common/controller";
import { RefreshTokenService } from "@/common/services";
import { Model } from "mongoose";
import { TYPES } from "@/common";
import { LearnerHomeController } from "@/learner";
import { LearnerProfileController } from "@/learner";
import { CloudinaryService } from "@/common";
import { ProfesionalVerificationController } from "@/professionals";
import { IUserRepo, UserRepo } from "@/common/Repo";
import { UserDtoMapper } from "@/common/dtos/mapper/user.map";
import { IPendingSignupRepo, PendingSignupRepo } from "@/common/Repo/pendingSignup.repo";
import { AuthOrchestrator } from "@/common/services/auth.orchestrator";
import { IAuthOrchestrator } from "@/common";
export const container = new Container();

// Bindings
container.bind<Model<IUser>>(TYPES.IUserModel).toConstantValue(User);
container.bind<IUserRepo>(TYPES.IUserRepo).to(UserRepo);
container.bind<IPendingSignupRepo>(TYPES.IPendingSignupRepo).to(PendingSignupRepo);

container.bind(TYPES.ITokenService).to(TokenService).inSingletonScope();
container.bind(TYPES.IEmailService).to(EmailService).inSingletonScope();
container.bind(TYPES.IOtpService).to(OtpService).inSingletonScope();
container.bind(TYPES.IPasswordService).to(PasswordService).inSingletonScope();
container.bind(TYPES.ICloudinaryService).to(CloudinaryService).inSingletonScope();
container.bind(TYPES.IEmailAuthService).to(EmailAuthService).inSingletonScope();
container.bind(TYPES.IRedisRepository).toConstantValue(new RedisRepository(redisClient));
container.bind(TYPES.IUserDtoMapper).to(UserDtoMapper).inSingletonScope();
container.bind<IAuthProviderService>(TYPES.IProviderAuth).to(GoogleAuthProvider);
container.bind<IAuthOrchestrator>(TYPES.IAuthOrchestrator).to(AuthOrchestrator);
container.bind<IAuthController>(TYPES.IAuthController).to(AuthController);
container.bind<IPasswordResetService>(TYPES.IPasswordResetService).to(PasswordResetService);

//refresh service
container.bind(TYPES.IRefreshService).toDynamicValue(() => {
  return new RefreshTokenService(
    container.get(TYPES.ITokenService),
    container.get(TYPES.IRedisRepository),
  );
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
