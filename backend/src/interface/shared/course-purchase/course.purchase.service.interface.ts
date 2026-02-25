import { ENROLLMENT_STATUS } from "@/types/learner/enrollment.status.type";
import { RazorpayPaymentType } from "@/types/shared/razorpay.payment.type";

export interface ICoursePurchaseService {
  startPurchase: (
    userId: string,
    courseId: string,
  ) => Promise<{ status: ENROLLMENT_STATUS; order?: RazorpayPaymentType }>;
}
