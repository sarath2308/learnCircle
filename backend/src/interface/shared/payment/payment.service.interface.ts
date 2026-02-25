import { PaymentPurpose } from "@/constants/shared/payment.purpose.type";
import { PAYMENT_STATUS } from "@/constants/shared/paymnet.status";
import { RazorpayPaymentType } from "@/types/shared/razorpay.payment.type";

export interface IPaymentService {
  createPayment: (
    userId: string,
    metaData: { amount: number; purpose: PaymentPurpose; referenceId: string },
  ) => Promise<RazorpayPaymentType>;
  handleWebhook: (rawBody: Buffer, signature: string) => Promise<void>;
  getPaymentStatus: (orderid: string) => Promise<PAYMENT_STATUS>;
}
