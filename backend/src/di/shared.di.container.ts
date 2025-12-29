import { UserDtoMapper } from "@/mapper/shared/user.map";
import { S3Service } from "@/utils/s3.service";
import { AuthenticateMiddleware } from "@/middleware";
import { EmailAuthService } from "@/services/shared/auth/email.auth.service";
import redisClient from "@/config/redis/redis";
import { RedisRepository } from "@/repos/shared/redisRepo";
import { IS3Service } from "@/interface/shared/s3.service.interface";
import { IAuthProviderService } from "@/interface/shared/auth/auth.provider.interface";
import { GoogleAuthProvider } from "@/services/shared/auth/google.auth.service";
import { IAuthOrchestrator } from "@/interface/shared/auth/auth.orchestrator.interface";
import { AuthOrchestrator } from "@/services/shared/auth/auth.orchestrator";
import { IAuthController } from "@/interface/shared/auth/auth.controller.interface";
import { AuthController } from "@/controllers/shared/auth.controller";
import { IPasswordResetService } from "@/interface/shared/password.reset.interface";
import { PasswordResetService } from "@/services/shared/auth/password.reset.service";
import { IAuthenticateMiddleware } from "@/interface/shared/auth/authentication.middlware.interface";
import { RefreshTokenService } from "@/services/shared/auth/refreshToken.service";
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
import ICourseRepo from "@/interface/shared/course/course.repo.interface";
import { ILesson, Lesson } from "@/model/shared/lesson.model";
import ILessonRepo from "@/interface/shared/lesson/lesson.repo.interface";
import { IUser, User } from "@/model/shared/user.model";
import { Model } from "mongoose";
import { IUserRepo, UserRepo } from "@/repos/shared/user.repo";
import { LessonRepo } from "@/repos/shared/lesson.repo";
import { CourseRepo } from "@/repos/shared/course.repo";
import { TYPES } from "@/types/shared/inversify/types";
import { Container } from "inversify";
import ICourseService from "@/interface/shared/course/course.service.interface";
import { CourseService } from "@/services/shared/course/course.service";
import { ICourseController } from "@/interface/shared/course/course.controller.interface";
import { CourseController } from "@/controllers/shared/course.controller";
import { ImageCompressor } from "@/utils/image.compress.service";
import { VideoCompressor } from "@/utils/video.compress.service";
import { Chapter, IChapter } from "@/model/shared/chapter.model";
import { IChapterRepo } from "@/interface/shared/chapter/chapter.repo.interface";
import { ChapterRepo } from "@/repos/shared/chapter.repo";
import { IChapterService } from "@/interface/shared/chapter/chapter.service.interface";
import { ChapterService } from "@/services/shared/course/chapter.service";
import { IChapterController } from "@/interface/shared/chapter/chapter.controller.interface";
import { ChapterController } from "@/controllers/shared/chapter.controller";
import { ISafeDeleteService, SafeDeleteService } from "@/utils/safe.delete.service";
import ILessonService from "@/interface/shared/lesson/lesson.service.interface";
import { LessonService } from "@/services/shared/course/lesson.service";
import { LessonController } from "@/controllers/shared/lesson.controller";
import { ILessonController } from "@/interface/shared/lesson/lesson.controller.interface";

export const registerShared = (container: Container): void => {
  /*-------------------Model-----------------------*/
  container.bind<Model<IUser>>(TYPES.IUserModel).toConstantValue(User);
  container.bind<Model<ICourse>>(TYPES.ICourseModel).toConstantValue(Course);
  container.bind<Model<ILesson>>(TYPES.ILessonModel).toConstantValue(Lesson);
  container.bind<Model<IChapter>>(TYPES.IChapterModel).toConstantValue(Chapter);
  /*-------------------Repo-----------------------*/

  container.bind<ICourseRepo>(TYPES.ICourseRepo).to(CourseRepo);
  container.bind<ILessonRepo>(TYPES.ILessonRepo).to(LessonRepo);
  container.bind<IChapterRepo>(TYPES.IChapterRepo).to(ChapterRepo);
  container.bind<IUserRepo>(TYPES.IUserRepo).to(UserRepo);
  container.bind(TYPES.IRedisRepository).toConstantValue(new RedisRepository(redisClient));

  /*-------------------Service-----------------------*/

  container.bind(TYPES.ITokenService).to(TokenService).inSingletonScope();
  container.bind(TYPES.IEmailService).to(EmailService).inSingletonScope();
  container.bind(TYPES.IOtpService).to(OtpService).inSingletonScope();
  container.bind(TYPES.IPasswordService).to(PasswordService).inSingletonScope();
  container.bind(TYPES.ICloudinaryService).to(CloudinaryService).inSingletonScope();
  container.bind(TYPES.IEmailAuthService).to(EmailAuthService).inSingletonScope();
  container.bind<IPasswordResetService>(TYPES.IPasswordResetService).to(PasswordResetService);
  container.bind<ICourseService>(TYPES.ICourseService).to(CourseService);
  container.bind(TYPES.ImageCompressService).to(ImageCompressor);
  container.bind(TYPES.VideoCompressService).to(VideoCompressor);
  container.bind(TYPES.IUserDtoMapper).to(UserDtoMapper).inSingletonScope();
  container.bind<IS3Service>(TYPES.IS3Service).to(S3Service);
  container.bind<IAuthProviderService>(TYPES.IProviderAuth).to(GoogleAuthProvider);
  container.bind<IAuthOrchestrator>(TYPES.IAuthOrchestrator).to(AuthOrchestrator);
  container.bind<IChapterService>(TYPES.IChapterService).to(ChapterService);
  container.bind<ISafeDeleteService>(TYPES.ISafeDeleteService).to(SafeDeleteService);
  container.bind<ILessonService>(TYPES.ILessonService).to(LessonService);

  /*-------------------Controller------------------------*/
  container.bind<IAuthController>(TYPES.IAuthController).to(AuthController);
  container.bind<ICourseController>(TYPES.ICourseController).to(CourseController);
  container.bind<IChapterController>(TYPES.IChapterController).to(ChapterController);
  container.bind<ILessonController>(TYPES.ILessonController).to(LessonController);
  /*-------------------Middleware------------------------*/

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
