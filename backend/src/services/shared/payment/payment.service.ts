import { razorpay } from "@/config/razorpay/razorpay.config";
import { PaymentPurpose } from "@/constants/shared/payment.purpose.type";
import { PAYMENT_STATUS } from "@/constants/shared/paymnet.status";
import { AppError } from "@/errors/app.error";
import { IPaymentRepo } from "@/interface/shared/payment/payment.repo.interface";
import { IPaymentService } from "@/interface/shared/payment/payment.service.interface";
import { TYPES } from "@/types/shared/inversify/types";
import { inject, injectable } from "inversify";
import mongoose from "mongoose";
import { createHmac } from "crypto";
import { Messages } from "@/constants/shared/messages";
import { HttpStatus } from "@/constants/shared/httpStatus";
import { IEnrollRepo } from "@/interface/shared/enroll/enroll.repo.interface";
import { RazorpayPaymentType } from "@/types/shared/razorpay.payment.type";
import { ISessionBookingRepo } from "@/interface/shared/session-booking/booking/session.booking.repo.interface";

injectable();
export class PaymentService implements IPaymentService {
  constructor(
    @inject(TYPES.IPaymentRepo) private _paymentRepo: IPaymentRepo,
    @inject(TYPES.IEnrollRepo) private _enrollRepo: IEnrollRepo,
    @inject(TYPES.ISessionBookingRepo) private _sessionBookingRepo: ISessionBookingRepo,
  ) {}

  async createPayment(
    userId: string,
    metaData: { amount: number; purpose: PaymentPurpose; referenceId: string },
  ): Promise<RazorpayPaymentType> {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const refObjectId = new mongoose.Types.ObjectId(metaData.referenceId);

    const paymentData = await this._paymentRepo.create({
      userId: userObjectId,
      purpose: metaData.purpose,
      referenceId: refObjectId,
      amount: metaData.amount,
      currency: "INR",
      status: PAYMENT_STATUS.PENDING,
    });

    const amountInPaise = Math.round(Number(metaData.amount) * 100);

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: String(paymentData.id),
      notes: {
        userId: userId,
        type: metaData.purpose,
        referenceId: metaData.referenceId,
      },
    });

    paymentData.orderId = order.id;
    await paymentData.save();

    return {
      orderId: order.id,
      key: process.env.RAZORPAY_API_KEY!,
      amount: metaData.amount,
      currency: "INR",
    };
  }

  async handleWebhook(rawBody: Buffer, signature: string): Promise<void> {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;
    const expectedSignature = createHmac("sha256", secret).update(rawBody).digest("hex");

    if (expectedSignature !== signature) {
      throw new Error("Invalid Razorpay webhook signature");
    }

    // 2. Parse payload (now it's trusted)
    const payload = JSON.parse(rawBody.toString("utf8"));

    const event = payload.event as string;

    // You can handle multiple events if you want
    if (event !== "payment.captured" && event !== "order.paid") {
      // Ignore events you don't care about
      return;
    }

    const paymentEntity = payload.payload?.payment?.entity;
    if (!paymentEntity) {
      throw new Error("Invalid Razorpay payload structure");
    }

    const razorpayOrderId: string = paymentEntity.order_id;
    const razorpayPaymentId: string = paymentEntity.id;
    const status: string = paymentEntity.status; // "captured", etc.

    if (!razorpayOrderId) {
      throw new Error("Missing razorpay order_id in webhook");
    }

    // 3. Find your payment record by razorpayOrderId
    const payment = await this._paymentRepo.getPaymentWithOrderId(razorpayOrderId);

    if (!payment) {
      // You didn't create this order → log and ignore
      console.warn("Payment not found for order:", razorpayOrderId);
      return;
    }

    // 4. Idempotency: if already PAID, do nothing
    if (payment.status === PAYMENT_STATUS.PAID) {
      return;
    }

    if (status !== "captured") {
      // You can mark FAILED here if you want
      await this._paymentRepo.markFailed(String(payment._id), razorpayPaymentId);
      return;
    }

    // 6. Mark as PAID in DB
    await this._paymentRepo.markPaid(String(payment._id), razorpayPaymentId);

    // 7. Trigger business action based on purpose
    if (payment.purpose === PaymentPurpose.COURSE) {
      await this._enrollRepo.create({
        userId: payment.userId,
        courseId: payment.referenceId,
        paymentId: payment._id,
      });
    } else if (payment.purpose === PaymentPurpose.SESSION) {
      await this._sessionBookingRepo.confirmSessionBooking(String(payment.referenceId));
    } else {
      console.warn("Unknown payment purpose:", payment.purpose);
    }
  }
  async getPaymentStatus(orderid: string): Promise<PAYMENT_STATUS> {
    const paymentData = await this._paymentRepo.getPaymentWithOrderId(orderid);
    if (!paymentData) {
      throw new AppError(Messages.PAYMENT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return paymentData.status;
  }
}
