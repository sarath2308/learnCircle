import { UserDtoMapper } from "@/mapper/shared/user.map";
import { S3Service } from "@/utils/s3.service";
import { AuthenticateMiddleware } from "@/middleware";
import { EmailAuthService } from "@/services/shared/auth/email.auth.service";
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
import { EmailService, OtpService, PasswordService, TokenService } from "@/utils";

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
import { IMessage, Message } from "@/model/shared/messages";
import { Enrollment, IEnroll } from "@/model/shared/enroll";
import { Conversation, IConversation } from "@/model/shared/conversation.model";
import { IPayment, Payment } from "@/model/shared/payments";
import { IMessageRepo } from "@/interface/shared/messages/message.repo.interface";
import { MessageRepo } from "@/repos/shared/message.repo";
import { IPaymentRepo } from "@/interface/shared/payment/payment.repo.interface";
import { PaymentRepo } from "@/repos/shared/payment.repo";
import { IEnrollRepo } from "@/interface/shared/enroll/enroll.repo.interface";
import { EnrollRepo } from "@/repos/shared/enroll.repo";
import { IChatService } from "@/interface/shared/chat/chat.service.interface";
import { ChatService } from "@/services/shared/chat/chat.service";
import { IChatController } from "@/interface/shared/chat/chat.controller.interface";
import { ChatController } from "@/controllers/shared/chat.controller";
import { ISocketHandler } from "@/interface/shared/socket/socket.handler.interface";
import { SocketHandler } from "@/socket/socket.handler";
import {
  ISocketAuthMiddleware,
  SocketAuthMiddleware,
} from "@/middleware/socket/socket.auth.middleware";
import { ConversationRepo } from "@/repos/shared/conversation.repo";
import { IConversationRepo } from "@/interface/shared/conversation/conversation.repo.interface";
import {
  ConversationParticipant,
  IConversationParticipant,
} from "@/model/shared/conversation.participants";
import { IConversationParticipantRepo } from "@/interface/shared/conversation/conversation.participant.interface";
import { ConversationParticipantRepo } from "@/repos/shared/conversation.participant.repo";
import { AvailabilityModel, IAvailability } from "@/model/shared/availability.model";
import {
  AvailabilityExceptionModel,
  IAvailabilityException,
} from "@/model/shared/availability.exception.model";
import { ISessionBooking, SessionBookingModel } from "@/model/shared/session.booking.model";
import { IAvailabilityRepo } from "@/interface/shared/session-booking/availabillity/availability.repo.interface";
import { AvailabilityRepo } from "@/repos/shared/availability.repo";
import { IAvailabilityExceptionRepo } from "@/interface/shared/session-booking/availability-exception/availability.exception.repo.interface";
import { AvailabilityExceptionRepo } from "@/repos/shared/availability.exception.repo";
import { ISessionBookingRepo } from "@/interface/shared/session-booking/booking/session.booking.repo.interface";
import { SessionBookingRepo } from "@/repos/shared/session.booking.repo";
import { IAvailabilityService } from "@/interface/shared/session-booking/availabillity/availability.service.interface";
import { AvailabilityService } from "@/services/shared/session-booking/availability.service";
import { IAvailabilityExceptionService } from "@/interface/shared/session-booking/availability-exception/availability.exception.service.interface";
import { AvailabilityExceptionService } from "@/services/shared/session-booking/availability.exception.service";
import { ISessionBookingService } from "@/interface/shared/session-booking/booking/session.booking.service.interface";
import { SessionBookingService } from "@/services/shared/session-booking/session.booking.service";
import { IAvailabilityController } from "@/interface/shared/session-booking/availabillity/availability.controller.interface";
import { AvailabilityController } from "@/controllers/shared/availability.controller";
import { IAvailabilityExceptionController } from "@/interface/shared/session-booking/availability-exception/availability.exception.controller";
import { AvailabilityExceptionController } from "@/controllers/shared/availability.exception.controller";
import { ISessionBookingController } from "@/interface/shared/session-booking/booking/session.booking.controller";
import { SessionBookingController } from "@/controllers/shared/session.booking.controller";
import { IMapper } from "@/interface/shared/mapper/mapper.interface";
import { AvailabilityMapper } from "@/mapper/shared/availability/availability.mapper";
import { AvailabilityResponseType } from "@/schema/shared/availability/availability.response.schema";
import { ISlotGenerator } from "@/interface/shared/ISlotGenerator";
import { SlotGenerator } from "@/utils/slot.generator.service";
import { SessionBookingResponseType } from "@/schema/learner/session.booking/session.booking.response.schema";
import { SessionBookingMapper } from "@/mapper/shared/session-booking/session.booking.mapper";
import { IInstructorReview, InstructorReviewModel } from "@/model/shared/insturctor.review.mode";
import { CourseReviewModel, ICourseReview } from "@/model/shared/course.review.model";
import { ICourseReviewService } from "@/interface/shared/course-review/course.review.service.interface";
import { ICourseReviewRepo } from "@/interface/shared/course-review/course.review.interface";
import { CourseReviewRepo } from "@/repos/shared/course.review.repo";
import { IInstructorReviewRepo } from "@/interface/shared/instuctor-review/instructor.review.repo.interface";
import { InstructorReviewRepo } from "@/repos/shared/instructor.review.repo";
import { CourseReviewService } from "@/services/shared/course-review/course.review.service";
import { IInstructorReviewService } from "@/interface/shared/instuctor-review/instructor.review.service.interface";
import { InstructorReviewService } from "@/services/shared/intructor-review/instructo.review.service";
import { ICourseReviewController } from "@/interface/shared/course-review/course.review.controller.interface";
import { CourseReviewController } from "@/controllers/shared/course.review.controller";
import { IInstructorReviewController } from "@/interface/shared/instuctor-review/instructor.review.controller";
import { InstructorReviewResponseType } from "@/schema/shared/review/instructor-review/instructor.review.response.schema";
import { InstructorReviewMapper } from "@/mapper/shared/instructor-review/instructor.review.mapper";
import { CourseReviewMapper } from "@/mapper/shared/course-review/course.review.mapper";
import { CourseReviewResponseType } from "@/schema/shared/review/course-review/course.review.response.schema";
import { InstructorReviewController } from "@/controllers/shared/instructor.review.controller";
import { IChatBotService } from "@/interface/shared/chatbot/chatbot.service.interface";
import { IChatBotController } from "@/interface/shared/chatbot/chatbot.controller.interface";
import { ChatBotController } from "@/controllers/shared/chatbot.controller";
import { ISocketEmitService } from "@/interface/shared/socket/socket.emit.interface";
import { SocketEmitService } from "@/socket/socket.emit";
import { ChatBotService } from "@/utils/chatbot.service";
import { INotification, NotificationModel } from "@/model/shared/notification.model";
import { INotificationRepo } from "@/interface/shared/notification/notification.repo.interface";
import { NotificationRepo } from "@/repos/shared/notification.repo";
import { INotificationService } from "@/interface/shared/notification/notification.service.interface";
import { NotificationService } from "@/services/shared/notification/notification.service";
import { INotificationController } from "@/interface/shared/notification/notification.controller.interface";
import { NotificationController } from "@/controllers/shared/notification.controller";
import { getRedisClient } from "@/config/redis/redis";
import { IPaymentService } from "@/interface/shared/payment/payment.service.interface";
import { PaymentService } from "@/services/shared/payment/payment.service";
import { IEnrollmentService } from "@/interface/shared/enroll/enroll.service.interface";
import { EnrollmentService } from "@/services/shared/enrollment/enrollment.service";
import { ICoursePurchaseService } from "@/interface/shared/course-purchase/course.purchase.service.interface";
import { CoursePurchaseService } from "@/services/shared/enrollment/course.purchase.service";
import { IEnrollmentController } from "@/interface/shared/enroll/enrollment.controller.interface";
import { EnrollmentController } from "@/controllers/shared/enrollment.controlller";
import { IPaymentController } from "@/interface/shared/payment/payment.controller.interface";
import { PaymentController } from "@/controllers/shared/payment.controller";

export const registerShared = (container: Container): void => {
  /*-------------------Model-----------------------*/
  container.bind<Model<IUser>>(TYPES.IUserModel).toConstantValue(User);
  container.bind<Model<ICourse>>(TYPES.ICourseModel).toConstantValue(Course);
  container.bind<Model<ILesson>>(TYPES.ILessonModel).toConstantValue(Lesson);
  container.bind<Model<IChapter>>(TYPES.IChapterModel).toConstantValue(Chapter);
  container.bind<Model<IMessage>>(TYPES.IMessage).toConstantValue(Message);
  container.bind<Model<IEnroll>>(TYPES.IEnroll).toConstantValue(Enrollment);
  container.bind<Model<IConversation>>(TYPES.IConversation).toConstantValue(Conversation);
  container.bind<Model<IPayment>>(TYPES.IPayment).toConstantValue(Payment);
  container
    .bind<Model<IConversationParticipant>>(TYPES.IConversationParticipant)
    .toConstantValue(ConversationParticipant);
  container.bind<Model<IAvailability>>(TYPES.IAvailability).toConstantValue(AvailabilityModel);
  container
    .bind<Model<IAvailabilityException>>(TYPES.IAvailabilityException)
    .toConstantValue(AvailabilityExceptionModel);
  container
    .bind<Model<ISessionBooking>>(TYPES.ISessionBooking)
    .toConstantValue(SessionBookingModel);

  container
    .bind<Model<IInstructorReview>>(TYPES.IInstructorReviewModel)
    .toConstantValue(InstructorReviewModel);
  container.bind<Model<ICourseReview>>(TYPES.ICourseReviewModel).toConstantValue(CourseReviewModel);
  container.bind<Model<INotification>>(TYPES.INotificationModel).toConstantValue(NotificationModel);
  /*-------------------Repo-----------------------*/

  container.bind<ICourseRepo>(TYPES.ICourseRepo).to(CourseRepo);
  container.bind<ILessonRepo>(TYPES.ILessonRepo).to(LessonRepo);
  container.bind<IChapterRepo>(TYPES.IChapterRepo).to(ChapterRepo);
  container.bind<IUserRepo>(TYPES.IUserRepo).to(UserRepo);
  container.bind(TYPES.IRedisRepository).toConstantValue(new RedisRepository(getRedisClient));
  container.bind<IMessageRepo>(TYPES.IMessageRepo).to(MessageRepo);
  container.bind<IConversationRepo>(TYPES.IConversationRepo).to(ConversationRepo);
  container.bind<IPaymentRepo>(TYPES.IPaymentRepo).to(PaymentRepo);
  container.bind<IEnrollRepo>(TYPES.IEnrollRepo).to(EnrollRepo);
  container
    .bind<IConversationParticipantRepo>(TYPES.IConversationParticipantRepo)
    .to(ConversationParticipantRepo);
  container.bind<IAvailabilityRepo>(TYPES.IAvailabilityRepo).to(AvailabilityRepo);
  container
    .bind<IAvailabilityExceptionRepo>(TYPES.IAvailabilityExceptionRepo)
    .to(AvailabilityExceptionRepo);
  container.bind<ISessionBookingRepo>(TYPES.ISessionBookingRepo).to(SessionBookingRepo);
  container.bind<ICourseReviewRepo>(TYPES.ICourseReviewRepo).to(CourseReviewRepo);
  container.bind<IInstructorReviewRepo>(TYPES.IInstructorReviewRepo).to(InstructorReviewRepo);
  container.bind<INotificationRepo>(TYPES.INotificationRepo).to(NotificationRepo);

  /*-------------------Service-----------------------*/

  container.bind(TYPES.ITokenService).to(TokenService).inSingletonScope();
  container.bind(TYPES.IEmailService).to(EmailService).inSingletonScope();
  container.bind(TYPES.IOtpService).to(OtpService).inSingletonScope();
  container.bind(TYPES.IPasswordService).to(PasswordService).inSingletonScope();
  container.bind(TYPES.IEmailAuthService).to(EmailAuthService).inSingletonScope();
  container.bind<IPasswordResetService>(TYPES.IPasswordResetService).to(PasswordResetService);
  container.bind<ICourseService>(TYPES.ICourseService).to(CourseService);
  container.bind(TYPES.ImageCompressService).to(ImageCompressor);
  container.bind(TYPES.IUserDtoMapper).to(UserDtoMapper).inSingletonScope();
  container.bind<IS3Service>(TYPES.IS3Service).to(S3Service);
  container.bind<IAuthProviderService>(TYPES.IProviderAuth).to(GoogleAuthProvider);
  container.bind<IAuthOrchestrator>(TYPES.IAuthOrchestrator).to(AuthOrchestrator);
  container.bind<IChapterService>(TYPES.IChapterService).to(ChapterService);
  container.bind<ISafeDeleteService>(TYPES.ISafeDeleteService).to(SafeDeleteService);
  container.bind<ILessonService>(TYPES.ILessonService).to(LessonService);
  container.bind<IChatService>(TYPES.IChatService).to(ChatService);
  container.bind<IAvailabilityService>(TYPES.IAvailabilityService).to(AvailabilityService);
  container
    .bind<IAvailabilityExceptionService>(TYPES.IAvailabilityExceptionService)
    .to(AvailabilityExceptionService);
  container.bind<ISessionBookingService>(TYPES.ISessionBookingService).to(SessionBookingService);
  container.bind<ISlotGenerator>(TYPES.ISlotGenerator).to(SlotGenerator);
  container.bind<ICourseReviewService>(TYPES.ICourseReviewService).to(CourseReviewService);
  container
    .bind<IInstructorReviewService>(TYPES.IInstructorReviewService)
    .to(InstructorReviewService);

  container.bind<IChatBotService>(TYPES.IChatBotService).to(ChatBotService);
  container.bind<ISocketEmitService>(TYPES.ISocketEmitService).to(SocketEmitService);
  container.bind<INotificationService>(TYPES.INotificationService).to(NotificationService);
  container.bind<IPaymentService>(TYPES.IPaymentService).to(PaymentService);
  container.bind<IEnrollmentService>(TYPES.IEnrollmentService).to(EnrollmentService);
  container.bind<ICoursePurchaseService>(TYPES.ICoursePurchaseService).to(CoursePurchaseService);
  /*-------------------Controller------------------------*/
  container.bind<IAuthController>(TYPES.IAuthController).to(AuthController);
  container.bind<ICourseController>(TYPES.ICourseController).to(CourseController);
  container.bind<IChapterController>(TYPES.IChapterController).to(ChapterController);
  container.bind<ILessonController>(TYPES.ILessonController).to(LessonController);
  container.bind<IChatController>(TYPES.IChatController).to(ChatController);
  container.bind<IAvailabilityController>(TYPES.IAvailabilityController).to(AvailabilityController);
  container
    .bind<IAvailabilityExceptionController>(TYPES.IAvailabilityExceptionController)
    .to(AvailabilityExceptionController);
  container
    .bind<ISessionBookingController>(TYPES.ISessionBookingController)
    .to(SessionBookingController);

  container.bind<ICourseReviewController>(TYPES.ICourseReviewController).to(CourseReviewController);
  container
    .bind<IInstructorReviewController>(TYPES.IInstructorReviewController)
    .to(InstructorReviewController);

  container.bind<IChatBotController>(TYPES.IChatBotController).to(ChatBotController);
  container.bind<INotificationController>(TYPES.INotificationController).to(NotificationController);
  container.bind<IEnrollmentController>(TYPES.IEnrollmentController).to(EnrollmentController);
  container.bind<IPaymentController>(TYPES.IPaymentController).to(PaymentController);

  /*-------------------Middleware------------------------*/

  container.bind<IAuthenticateMiddleware>(TYPES.IAuthenticateMiddleware).to(AuthenticateMiddleware);
  container.bind<ISocketAuthMiddleware>(TYPES.ISocketAuthMiddleware).to(SocketAuthMiddleware);

  //handler
  container.bind<ISocketHandler>(TYPES.ISocketHandler).to(SocketHandler);

  //mapper
  container
    .bind<IMapper<IAvailability, AvailabilityResponseType>>(TYPES.IAvailabilityMapper)
    .to(AvailabilityMapper);

  container
    .bind<IMapper<ISessionBooking, SessionBookingResponseType>>(TYPES.ISessionBookingMapper)
    .to(SessionBookingMapper);

  container
    .bind<
      IMapper<IInstructorReview, InstructorReviewResponseType>
    >(TYPES.IInstructorReviewDtoMapper)
    .to(InstructorReviewMapper);

  container
    .bind<IMapper<ICourseReview, CourseReviewResponseType>>(TYPES.ICourseReviewMapper)
    .to(CourseReviewMapper);

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
