import { Container } from "inversify";
import "reflect-metadata";

// import interfaces and classes
import { TYPES } from "@/types/shared/inversify/types";

import { UserDtoMapper } from "@/mapper/shared/user.map";
import { S3Service } from "@/utils/s3.service";
import { ILearnerProfileController } from "@/interface/learner/ILearnerProfileController";
import { AuthenticateMiddleware } from "@/middleware";
import { ILearnerHomeService } from "@/interface/learner/ILearnerHomeService";
import { ILearnerHomeController } from "@/interface/learner/ILearnerHomeController";
import { LearnerProfileMapperService } from "@/mapper/learner/learnerProfile.dto.mapper";
import { IProfessionalProfileController } from "@/interface/professional/IProfessionalProfileController";
import { ProfessionalDashboardDtoMapper } from "@/schema/professional/dashboard.dtos.mapper";
import { IProfessionalDashboardController } from "@/interface/professional/IProfessionalDashboardController";
import { IAdminDashboardService } from "@/interface/admin/IAdminDashboardService";
import { IAdminDashboardController } from "@/interface/admin/IAdminDashboardController";
import { AdminUserManagementService } from "@/services/admin/admin.userManagement.service";
import { IAdminUserManagementController } from "@/interface/admin/IAdminUserManagementController";
import { Course, ICourse } from "@/model/shared/course.model";
import ICourseRepo from "@/interface/shared/ICourseRepo";
import { ILesson, Lesson } from "@/model/shared/lesson.model";
import ILessonRepo from "@/interface/shared/ILessonRepo";
import { IUser, User } from "@/model/shared/user.model";
import { Model } from "mongoose";
import { IUserRepo, UserRepo } from "@/repos/shared/user.repo";
import { ILearnerProfile, LearnerProfile } from "@/model/learner/learner.profile.model";
import { LessonRepo } from "@/repos/shared/lesson.repo";
import { IProfessionalProfileRepo } from "@/interface/professional/IProfessionalProfileRepo";
import { ProfessionalProfileRepo } from "@/repos/professional/professional.profile.repo";
import { LearnerProfileRepo } from "@/repos/learner/learner.profile.repo";
import { ILearnerProfileRepo } from "@/interface/learner/ILearnerProfileRepo";
import { CourseRepo } from "@/repos/shared/course.repo";
import { EmailAuthService } from "@/services/shared/email.auth.service";
import redisClient from "../redis/redis";
import { RedisRepository } from "@/repos/shared/redisRepo";
import { IS3Service } from "@/interface/shared/IS3Service";
import { IAuthProviderService } from "@/interface/shared/IAuthProviderService";
import { GoogleAuthProvider } from "@/services/shared/google.auth.service";
import { IAuthOrchestrator } from "@/interface/shared/IAuthOrchestrator";
import { AuthOrchestrator } from "@/services/shared/auth.orchestrator";
import { IAuthController } from "@/interface/shared/IAuthController";
import { AuthController } from "@/controllers/shared/auth.controller";
import { IPasswordResetService } from "@/interface/shared/IPasswordResetService";
import { PasswordResetService } from "@/services/shared/password.reset.service";
import { IAuthenticateMiddleware } from "@/interface/shared/IAuthenticateMiddleware";
import { ILearnerProfileService } from "@/interface/learner/ILearnerProfileService";
import { LearnerProfileService } from "@/services/learner/learner.profile.service";
import { ProfessionalDashboardController } from "@/controllers/professional/professional.dashboard.controller";
import { IProfessionalDashboardDtoMap } from "@/interface/professional/IProfessionalDasboardDtoMap";
import { IProfessionalDashboardService } from "@/interface/professional/IProfessionalDashboard";
import { ProfessionalDashboardService } from "@/services/professional/professional.dashboard.service";
import { IProfessionalProfileService } from "@/interface/professional/IProfessionalProfileService";
import { ProfessionalProfileService } from "@/services/professional/profesional.profile.service";
import { ProfessionalProfileController } from "@/controllers/professional/profesional.profile.controller";
import { ILearnerProfileMapperService } from "@/interface/learner/ILearnerProfileMapper";
import { LearnerProfileController } from "@/controllers/learner/learner.profile.controller";
import { IAdminUserManagementService } from "@/interface/admin/IAdminUserManagementService";
import { AdminUserManagementController } from "@/controllers/admin/admin.userManagement.controller";
import { AdminDashboardService } from "@/services/admin/admin.dashboard.service";
import { LearnerHomeService } from "@/services/learner/learner.home.service";
import { LearnerHomeController } from "@/controllers/learner/learner.home.controller";
import { RefreshTokenService } from "@/services/shared/refreshToken.service";
import { RefreshController } from "@/controllers/shared/refreshController";
import { AdminDashboardController } from "@/controllers/admin/admin.dashboard.controller";
import ProfessionalProfile, {
  IProfessionalProfile,
} from "@/model/professional/profesional.profile";
import {
  CloudinaryService,
  EmailService,
  OtpService,
  PasswordService,
  TokenService,
} from "@/utils";
import { Admin, IAdmin } from "@/model/admin/Admin";
export const container = new Container();

// Bindings
container.bind<Model<IUser>>(TYPES.IUserModel).toConstantValue(User);
container.bind<IUserRepo>(TYPES.IUserRepo).to(UserRepo);
container.bind<Model<ILearnerProfile>>(TYPES.ILearnerProfileModel).toConstantValue(LearnerProfile);
container.bind<Model<ICourse>>(TYPES.ICourseModel).toConstantValue(Course);
container.bind<Model<IAdmin>>(TYPES.IAdminModel).toConstantValue(Admin);
container.bind<Model<ILesson>>(TYPES.ILessonModel).toConstantValue(Lesson);
container.bind<ILessonRepo>(TYPES.ILessonRepo).to(LessonRepo);

container
  .bind<Model<IProfessionalProfile>>(TYPES.IProfessionalProfileModel)
  .toConstantValue(ProfessionalProfile);
container
  .bind<IProfessionalProfileRepo>(TYPES.IProfessionalProfileRepo)
  .to(ProfessionalProfileRepo);
container.bind<ILearnerProfileRepo>(TYPES.ILearnerProfileRepo).to(LearnerProfileRepo);
container.bind<ICourseRepo>(TYPES.ICourseRepo).to(CourseRepo);
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
container
  .bind<IAdminUserManagementService>(TYPES.IAdminUserManagementService)
  .to(AdminUserManagementService);
container
  .bind<IAdminUserManagementController>(TYPES.IAdminUserManagementController)
  .to(AdminUserManagementController);
container.bind<IAdminDashboardService>(TYPES.IAdminDashboardService).to(AdminDashboardService);
container
  .bind<IAdminDashboardController>(TYPES.IAdminDashboardController)
  .to(AdminDashboardController);
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
