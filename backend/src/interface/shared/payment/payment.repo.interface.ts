import { IPayment } from "@/model/shared/payments";
import { IBaseRepo } from "@/repos/shared/base";

export interface IPaymentRepo extends IBaseRepo<IPayment> {
  getPaymentWithOrderId: (orderId: string) => Promise<IPayment | null>;
  getByCourseAndUserId?: (courseId: string, userId: string) => Promise<IPayment | null>;
  markPaid: (paymentId: string) => Promise<void>;
  markFailed: (paymentId: string) => Promise<void>;
}
