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
import Razorpay from "razorpay";

@injectable()
export class PaymentService implements IPaymentService {
  private razorpay: any;
  constructor(
    @inject(TYPES.IPaymentRepo) private _paymentRepo: IPaymentRepo,
    @inject(TYPES.IEnrollRepo) private _enrollRepo: IEnrollRepo,
    @inject(TYPES.ISessionBookingRepo) private _sessionBookingRepo: ISessionBookingRepo,
  ) {
    const keyId = process.env.RAZORPAY_API_KEY;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      throw new Error("Razorpay keys are missing in environment variables");
    }

    this.razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }

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

    const order = await this.razorpay.orders.create({
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
    console.log("🔥 [Webhook] Hit Razorpay webhook endpoint");

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;
    console.log("🔑 [Webhook] Using webhook secret:", secret ? "SET" : "MISSING");

    const expectedSignature = createHmac("sha256", secret).update(rawBody).digest("hex");

    console.log("🧾 [Webhook] Received signature:", signature);
    console.log("🧾 [Webhook] Expected signature:", expectedSignature);

    if (expectedSignature !== signature) {
      console.error("❌ [Webhook] Signature mismatch. Rejecting webhook.");
      throw new Error("Invalid Razorpay webhook signature");
    }

    console.log("✅ [Webhook] Signature verified");

    // Parse payload
    const payloadStr = rawBody.toString("utf8");
    console.log("📦 [Webhook] Raw payload:", payloadStr);

    const payload = JSON.parse(payloadStr);

    const event = payload.event as string;
    console.log("📣 [Webhook] Event received:", event);

    // Ignore unwanted events
    if (event !== "payment.captured" && event !== "order.paid") {
      console.log("ℹ️ [Webhook] Ignoring event:", event);
      return;
    }

    const paymentEntity = payload.payload?.payment?.entity;
    if (!paymentEntity) {
      console.error("❌ [Webhook] Invalid payload structure. Missing payment.entity");
      throw new Error("Invalid Razorpay payload structure");
    }

    const razorpayOrderId: string = paymentEntity.order_id;
    const razorpayPaymentId: string = paymentEntity.id;
    const status: string = paymentEntity.status;

    console.log("🆔 [Webhook] razorpayOrderId:", razorpayOrderId);
    console.log("🆔 [Webhook] razorpayPaymentId:", razorpayPaymentId);
    console.log("📊 [Webhook] Razorpay status:", status);

    if (!razorpayOrderId) {
      console.error("❌ [Webhook] Missing razorpay order_id");
      throw new Error("Missing razorpay order_id in webhook");
    }

    // Find payment in DB
    const payment = await this._paymentRepo.getPaymentWithOrderId(razorpayOrderId);
    console.log("🔎 [Webhook] Payment found in DB:", payment ? "YES" : "NO");

    if (!payment) {
      console.warn("⚠️ [Webhook] Payment not found for order:", razorpayOrderId);
      return;
    }

    console.log("💾 [Webhook] Current DB payment status:", payment.status);

    // Idempotency check
    if (payment.status === PAYMENT_STATUS.PAID) {
      console.log("♻️ [Webhook] Payment already marked as PAID. Skipping.");
      return;
    }

    if (status !== "captured") {
      console.warn("⚠️ [Webhook] Payment not captured. Marking as FAILED.");
      await this._paymentRepo.markFailed(String(payment._id), razorpayPaymentId);
      console.log("❌ [Webhook] Marked payment as FAILED in DB");
      return;
    }

    // Mark as PAID
    console.log("✅ [Webhook] Marking payment as PAID in DB");
    await this._paymentRepo.markPaid(String(payment._id), razorpayPaymentId);
    console.log("✅ [Webhook] Payment marked as PAID");

    // Business logic
    console.log("🎯 [Webhook] Payment purpose:", payment.purpose);

    if (payment.purpose === PaymentPurpose.COURSE) {
      console.log("📚 [Webhook] Creating enrollment");
      await this._enrollRepo.create({
        userId: payment.userId,
        courseId: payment.referenceId,
        paymentId: payment._id,
      });
      console.log("✅ [Webhook] Enrollment created");
    } else if (payment.purpose === PaymentPurpose.SESSION) {
      console.log("📅 [Webhook] Confirming session booking");
      await this._sessionBookingRepo.confirmSessionBooking(String(payment.referenceId));
      console.log("✅ [Webhook] Session booking confirmed");
    } else {
      console.warn("⚠️ [Webhook] Unknown payment purpose:", payment.purpose);
    }

    console.log("🏁 [Webhook] Webhook processing completed successfully");
  }
  async getPaymentStatus(orderid: string): Promise<PAYMENT_STATUS> {
    const paymentData = await this._paymentRepo.getPaymentWithOrderId(orderid);
    if (!paymentData) {
      throw new AppError(Messages.PAYMENT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return paymentData.status;
  }
}
