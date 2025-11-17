import { UserDtoMapper } from "@/mapper/shared/user.map";
import { S3Service } from "@/utils/s3.service";
import { AuthenticateMiddleware } from "@/middleware";
import { EmailAuthService } from "@/services/shared/email.auth.service";
import redisClient from "@/config/redis/redis";
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
import { RefreshTokenService } from "@/services/shared/refreshToken.service";
import { RefreshController } from "@/controllers/shared/refreshController";
import {
  CloudinaryService,
  EmailService,
  OtpService,
  PasswordService,
  TokenService,
} from "@/utils";

// Models & Repos (shared)
import { Course, ICourse } from "@/model/shared/course.model";
import ICourseRepo from "@/interface/shared/ICourseRepo";
import { ILesson, Lesson } from "@/model/shared/lesson.model";
import ILessonRepo from "@/interface/shared/ILessonRepo";
import { IUser, User } from "@/model/shared/user.model";
import { Model } from "mongoose";
import { IUserRepo, UserRepo } from "@/repos/shared/user.repo";
import { LessonRepo } from "@/repos/shared/lesson.repo";
import { CourseRepo } from "@/repos/shared/course.repo";
import { TYPES } from "@/types/shared/inversify/types";
import { Container } from "inversify";

export const registerShared = (container: Container): void => {
  container.bind<Model<IUser>>(TYPES.IUserModel).toConstantValue(User);
  container.bind<IUserRepo>(TYPES.IUserRepo).to(UserRepo);
  container.bind<Model<ICourse>>(TYPES.ICourseModel).toConstantValue(Course);
  container.bind<Model<ILesson>>(TYPES.ILessonModel).toConstantValue(Lesson);
  container.bind<ICourseRepo>(TYPES.ICourseRepo).to(CourseRepo);
  container.bind<ILessonRepo>(TYPES.ILessonRepo).to(LessonRepo);

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

  // Refresh token (shared)
  container.bind(TYPES.IRefreshService).toDynamicValue(() => {
    return new RefreshTokenService(
      container.get(TYPES.ITokenService),
      container.get(TYPES.IRedisRepository),
    );
  });
  container.bind(TYPES.IRefreshController).toDynamicValue(() => {
    return new RefreshController(container.get(TYPES.IRefreshService));
  });
};
