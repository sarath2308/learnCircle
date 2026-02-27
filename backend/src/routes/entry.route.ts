import { authorizeRoles } from "@/middleware";
import { authEntryRoute } from "./shared/auth/auth.entry.route";
import { learnerEntryRoute } from "./learner/learner.entry.route";
import { professionalEntryRoute } from "./professional/professional.entry.route";
import { adminEntryRoute } from "./admin/admin.entry.route";
import { courseEntryRoute } from "./shared/course/course.entry.routes";
import container from "@/di/di.container";
import { IAuthenticateMiddleware } from "@/interface/shared/auth/authentication.middlware.interface";
import { TYPES } from "@/types/shared/inversify/types";
import { Router } from "express";
import { ROLE } from "@/constants/shared/Role";
import categoyRoutes from "./shared/category/category.routes";
import { wrapAsyncController } from "@/utils/wrapAsyncClass";
import { ISubCategoryController } from "@/interface/shared/category/subCat/sub.category.controller.interface";
import { ICategoryController } from "@/interface/shared/category/category.controller.interface";
import subCategoryRoutes from "./shared/category/sub.category.routes";
import { creatorEntryRoutes } from "./shared/course-creator/creator.entry";
import { chatRoutes } from "./shared/chat/chat.routes";
import { IChatController } from "@/interface/shared/chat/chat.controller.interface";
import { availabilityRoutes } from "./shared/availability/availability.routes";
import { IAvailabilityController } from "@/interface/shared/session-booking/availabillity/availability.controller.interface";
import { exceptionRoutes } from "./shared/availability-exception/exception.routes";
import { IAvailabilityExceptionController } from "@/interface/shared/session-booking/availability-exception/availability.exception.controller";
import { ISessionBookingController } from "@/interface/shared/session-booking/booking/session.booking.controller";
import { sessionBookingRoutes } from "./shared/session-booking/session.booking.routes";
import { ICourseReviewController } from "@/interface/shared/course-review/course.review.controller.interface";
import { CourseReviewRoutes } from "./shared/course-review/course.review.routes";
import { InstructorReviewRoutes } from "./shared/instructor-review/instructor.review.routes";
import { IInstructorReviewController } from "@/interface/shared/instuctor-review/instructor.review.controller";
import { IChatBotController } from "@/interface/shared/chatbot/chatbot.controller.interface";
import { ChatBotRoutes } from "./shared/chatbot/chatbot.routes";
import { INotificationController } from "@/interface/shared/notification/notification.controller.interface";
import { NotificationRoutes } from "./shared/notification/notification.routes";
import { PaymentRoute } from "./shared/payment-webhook/payment.routes";
import { IPaymentController } from "@/interface/shared/payment/payment.controller.interface";

export function entryRoute() {
  const authenticate = container.get<IAuthenticateMiddleware>(TYPES.IAuthenticateMiddleware);
  const categoryController = wrapAsyncController(
    container.get<ICategoryController>(TYPES.ICategoryController),
  );

  const subCategoryController = wrapAsyncController(
    container.get<ISubCategoryController>(TYPES.ISubCategoryController),
  );
  const chatController = wrapAsyncController(container.get<IChatController>(TYPES.IChatController));

  const availabilityController = wrapAsyncController(
    container.get<IAvailabilityController>(TYPES.IAvailabilityController),
  );

  const exceptionController = wrapAsyncController(
    container.get<IAvailabilityExceptionController>(TYPES.IAvailabilityExceptionController),
  );

  const sessionBookingController = wrapAsyncController(
    container.get<ISessionBookingController>(TYPES.ISessionBookingController),
  );

  const courseReviewController = wrapAsyncController(
    container.get<ICourseReviewController>(TYPES.ICourseReviewController),
  );
  const instructorReviewController = wrapAsyncController(
    container.get<IInstructorReviewController>(TYPES.IInstructorReviewController),
  );

  const chatBotController = wrapAsyncController(
    container.get<IChatBotController>(TYPES.IChatBotController),
  );

  const notificationController = wrapAsyncController(
    container.get<INotificationController>(TYPES.INotificationController),
  );

  const paymentController = wrapAsyncController(
    container.get<IPaymentController>(TYPES.IPaymentController),
  );
  const router = Router();

  router.use("/auth", authEntryRoute());

  router.use(
    "/learner",
    authenticate.handle.bind(authenticate),
    authorizeRoles(ROLE.LEARNER),
    learnerEntryRoute(),
  );

  router.use(
    "/professional",
    authenticate.handle.bind(authenticate),
    authorizeRoles(ROLE.PROFESSIONAL),
    professionalEntryRoute(),
  );

  router.use(
    "/admin",
    authenticate.handle.bind(authenticate),
    authorizeRoles(ROLE.ADMIN),
    adminEntryRoute(),
  );

  router.use(
    "/course",
    authenticate.handle.bind(authenticate),
    authorizeRoles(ROLE.ADMIN, ROLE.PROFESSIONAL, ROLE.LEARNER),
    courseEntryRoute(),
  );

  router.use(
    "/category",
    authenticate.handle.bind(authenticate),
    authorizeRoles(ROLE.ADMIN, ROLE.PROFESSIONAL, ROLE.LEARNER),
    categoyRoutes(categoryController),
  );

  router.use(
    "/category",
    authenticate.handle.bind(authenticate),
    authorizeRoles(ROLE.ADMIN, ROLE.PROFESSIONAL, ROLE.LEARNER),
    subCategoryRoutes(subCategoryController),
  );

  router.use(
    "/creator",
    authenticate.handle.bind(authenticate),
    authorizeRoles(ROLE.PROFESSIONAL, ROLE.ADMIN),
    creatorEntryRoutes(),
  );

  router.use(
    "/chat",
    authenticate.handle.bind(authenticate),
    authorizeRoles(ROLE.ADMIN, ROLE.LEARNER, ROLE.PROFESSIONAL),
    chatRoutes(chatController),
  );

  router.use(
    "/availability",
    authenticate.handle.bind(authenticate),
    authorizeRoles(ROLE.PROFESSIONAL),
    availabilityRoutes(availabilityController),
  );

  router.use(
    "/availability/exception",
    authenticate.handle.bind(authenticate),
    authorizeRoles(ROLE.PROFESSIONAL),
    exceptionRoutes(exceptionController),
  );

  router.use(
    "/session-booking",
    authenticate.handle.bind(authenticate),
    authorizeRoles(ROLE.LEARNER, ROLE.PROFESSIONAL, ROLE.ADMIN),
    sessionBookingRoutes(sessionBookingController),
  );

  router.use(
    "/course-review",
    authenticate.handle.bind(authenticate),
    authorizeRoles(ROLE.LEARNER),
    CourseReviewRoutes(courseReviewController),
  );
  router.use(
    "/instructor-review",
    authenticate.handle.bind(authenticate),
    authorizeRoles(ROLE.LEARNER, ROLE.PROFESSIONAL),
    InstructorReviewRoutes(instructorReviewController),
  );
  router.use(
    "/chat-bot",
    authenticate.handle.bind(authenticate),
    authorizeRoles(ROLE.LEARNER, ROLE.PROFESSIONAL),
    ChatBotRoutes(chatBotController),
  );
  router.use(
    "/notification",
    authenticate.handle.bind(authenticate),
    authorizeRoles(ROLE.LEARNER, ROLE.PROFESSIONAL),
    NotificationRoutes(notificationController),
  );
  router.use("/payment", authenticate.handle.bind(authenticate), PaymentRoute(paymentController));

  return router;
}
