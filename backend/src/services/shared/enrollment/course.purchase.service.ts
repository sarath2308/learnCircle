import { HttpStatus } from "@/constants/shared/httpStatus";
import { Messages } from "@/constants/shared/messages";
import { PaymentPurpose } from "@/constants/shared/payment.purpose.type";
import { AppError } from "@/errors/app.error";
import { ICoursePurchaseService } from "@/interface/shared/course-purchase/course.purchase.service.interface";
import ICourseRepo from "@/interface/shared/course/course.repo.interface";
import { IEnrollmentService } from "@/interface/shared/enroll/enroll.service.interface";
import { IPaymentService } from "@/interface/shared/payment/payment.service.interface";
import { ENROLLMENT_STATUS } from "@/types/learner/enrollment.status.type";
import { TYPES } from "@/types/shared/inversify/types";
import { RazorpayPaymentType } from "@/types/shared/razorpay.payment.type";
import { inject, injectable } from "inversify";

@injectable()
export class CoursePurchaseService implements ICoursePurchaseService {
  constructor(
    @inject(TYPES.ICourseRepo) private _courseRepo: ICourseRepo,
    @inject(TYPES.IEnrollmentService) private _enrollmentService: IEnrollmentService,
    @inject(TYPES.IPaymentService) private _paymentService: IPaymentService,
  ) {}

  async startPurchase(
    userId: string,
    courseId: string,
  ): Promise<{ status: ENROLLMENT_STATUS; order?: RazorpayPaymentType }> {
    const course = await this._courseRepo.findById(courseId);
    if (!course) throw new AppError(Messages.COURSE_NOT_FOUND, HttpStatus.NOT_FOUND);

    const isEnrolled = await this._enrollmentService.isEnrolled(userId, courseId);
    if (isEnrolled) {
      return { status: ENROLLMENT_STATUS.ALLREADY_ENROLLED };
    }

    if (course.type === "Free") {
      await this._enrollmentService.enroll(userId, courseId);
      return { status: ENROLLMENT_STATUS.ENROLLED };
    }

    let finalAmount = 0;
    if (course.price && course.discount)
      finalAmount = course.price - (course.price * course.discount) / 100;

    const order = await this._paymentService.createPayment(userId, {
      amount: finalAmount,
      purpose: PaymentPurpose.COURSE,
      referenceId: courseId,
    });

    return { status: ENROLLMENT_STATUS.PAYMENT_REQUERED, order };
  }
}
