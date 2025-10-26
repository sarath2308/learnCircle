import { Container } from "inversify";
import "reflect-metadata";

// import interfaces and classes
import {
  IAuthController,
  IAuthProviderService,
  IPasswordResetService,
  IS3Service,
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
import { TYPES } from "@/common/types/inversify/types";
import {
  ILearnerProfile,
  LearnerHomeController,
  LearnerHomeService,
  LearnerProfile,
  LearnerProfileController,
  LearnerProfileService,
} from "@/learner";
import { CloudinaryService } from "@/common";
import { IProfessionalProfile, ProfessionalProfileController } from "@/professionals";
import { IUserRepo, UserRepo } from "@/common/Repo";
import { UserDtoMapper } from "@/common/dtos/mapper/user.map";
import { AuthOrchestrator } from "@/common/services/auth.orchestrator";
import { IAuthOrchestrator } from "@/common";
import { S3Service } from "@/common/utils/s3.service";
import { ILearnerProfileRepo } from "@/learner/features/profile/interface/ILearnerProfileRepo";
import { LearnerProfileRepo } from "@/learner/features/profile/Repo/learner.profile.repo";
import { ILearnerProfileController } from "@/learner/features/profile/interface/ILearnerProfileController";
import { IAuthenticateMiddleware } from "@/common/interface/IAuthenticateMiddleware";
import { AuthenticateMiddleware } from "@/common/middleware";
import { ILearnerHomeService } from "@/learner/features/home/interface/ILearnerHomeService";
import { ILearnerHomeController } from "@/learner/features/home/interface/ILearnerHomeController";
import { ILearnerProfileService } from "@/learner/features/profile/interface/ILearnerProfileService";
import { ILearnerProfileMapperService } from "@/learner/features/profile/interface/ILearnerProfileMapper";
import { LearnerProfileMapperService } from "@/learner/features/profile/dtos/mapper/learnerProfile.dto.mapper";
import ProfessionalProfile from "@/professionals/features/profile/models/profesional.profile";
import { ProfessionalProfileRepo } from "@/professionals/features/profile/Repo/professional.profile.repo";
import { IProfessionalProfileRepo } from "@/professionals/features/profile/interface/IProfessionalProfileRepo";
import { IProfessionalProfileService } from "@/professionals/features/profile/interface/IProfessionalProfileService";
import { ProfessionalProfileService } from "@/professionals/features/profile/services/profesional.profile.service";
import { IProfessionalProfileController } from "@/professionals/features/profile/interface/IProfessionalProfileController";
import { IProfessionalDashboardDtoMap } from "@/professionals/features/dashboard/interfaces/IProfessionalDasboardDtoMap";
import { ProfessionalDashboardDtoMapper } from "@/professionals/features/dashboard/dtos/dashboard.dtos.mapper";
import { IProfessionalDashboardService } from "@/professionals/features/dashboard/interfaces/IProfessionalDashboard";
import { ProfessionalDashboardService } from "@/professionals/features/dashboard/service/professional.dashboard.service";
import { IProfessionalDashboardController } from "@/professionals/features/dashboard/interfaces/IProfessionalDashboardController";
import { ProfessionalDashboardController } from "@/professionals/features/dashboard/controller/professional.dashboard.controller";
export const container = new Container();

// Bindings
container.bind<Model<IUser>>(TYPES.IUserModel).toConstantValue(User);
container.bind<IUserRepo>(TYPES.IUserRepo).to(UserRepo);
container.bind<Model<ILearnerProfile>>(TYPES.ILearnerProfileModel).toConstantValue(LearnerProfile);
container
  .bind<Model<IProfessionalProfile>>(TYPES.IProfessionalProfileModel)
  .toConstantValue(ProfessionalProfile);
container.bind<IProfessionalProfileRepo>(TYPES.IProfesionalProfileRepo).to(ProfessionalProfileRepo);
container.bind<ILearnerProfileRepo>(TYPES.ILearnerProfileRepo).to(LearnerProfileRepo);
container.bind(TYPES.ITokenService).to(TokenService).inSingletonScope();
container.bind(TYPES.IEmailService).to(EmailService).inSingletonScope();
container.bind(TYPES.IOtpService).to(OtpService).inSingletonScope();
container.bind(TYPES.IPasswordService).to(PasswordService).inSingletonScope();
container.bind(TYPES.ICloudinaryService).to(CloudinaryService).inSingletonScope();
container.bind(TYPES.IEmailAuthService).to(EmailAuthService).inSingletonScope();
container.bind(TYPES.IRedisRepository).toConstantValue(new RedisRepository(redisClient));
container.bind(TYPES.IUserDtoMapper).to(UserDtoMapper).inSingletonScope();
container.bind<IS3Service>(TYPES.IS3Service).to(S3Service);
container.bind<IAuthProviderService>(TYPES.IProviderAuth).to(GoogleAuthProvider);
container.bind<IAuthOrchestrator>(TYPES.IAuthOrchestrator).to(AuthOrchestrator);
container.bind<IAuthController>(TYPES.IAuthController).to(AuthController);
container.bind<IPasswordResetService>(TYPES.IPasswordResetService).to(PasswordResetService);
container.bind<IAuthenticateMiddleware>(TYPES.IAuthenticateMiddleware).to(AuthenticateMiddleware);
container.bind<ILearnerProfileService>(TYPES.ILearnerProfileService).to(LearnerProfileService);
container
  .bind<IProfessionalDashboardController>(TYPES.IProfessionalDashboardController)
  .to(ProfessionalDashboardController);
container
  .bind<IProfessionalDashboardDtoMap>(TYPES.IProfessionalDashboardDtoMap)
  .to(ProfessionalDashboardDtoMapper);
container
  .bind<IProfessionalDashboardService>(TYPES.IProfessionalDashboardService)
  .to(ProfessionalDashboardService);
container
  .bind<IProfessionalProfileService>(TYPES.IProfessionalProfileService)
  .to(ProfessionalProfileService);
container
  .bind<IProfessionalProfileController>(TYPES.IProfessionalProfileController)
  .to(ProfessionalProfileController);
container
  .bind<ILearnerProfileMapperService>(TYPES.ILearnerProfileDto)
  .to(LearnerProfileMapperService);
container
  .bind<ILearnerProfileController>(TYPES.ILearnerProfileController)
  .to(LearnerProfileController);
container.bind<ILearnerHomeService>(TYPES.ILearnerHomeService).to(LearnerHomeService);
container.bind<ILearnerHomeController>(TYPES.ILearnerHomeController).to(LearnerHomeController);
//refresh service
container.bind(TYPES.IRefreshService).toDynamicValue(() => {
  return new RefreshTokenService(
    container.get(TYPES.ITokenService),
    container.get(TYPES.IRedisRepository),
  );
});

container.bind(TYPES.IRefreshController).toDynamicValue(() => {
  return new RefreshController(container.get(TYPES.IRefreshService));
});

export default container;
