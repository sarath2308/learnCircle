import { PaymentPurpose } from "@/constants/shared/payment.purpose.type";
import { PAYMENT_STATUS } from "@/constants/shared/paymnet.status";
import { Document, model, Schema, Types } from "mongoose";

export interface IPayment extends Document {
  _id: Types.ObjectId;

  sessionId: string;

  userId: Types.ObjectId;

  purpose: PaymentPurpose;

  courseId?: Types.ObjectId;
  //   subscriptionPlanId?: Types.ObjectId;
  //   sessionBookingId?: Types.ObjectId;

  amount: number;
  currency: "INR";

  status: PAYMENT_STATUS;

  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    sessionId: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    purpose: { type: String, enum: PaymentPurpose, required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course" },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: { type: String, enum: PAYMENT_STATUS, default: PAYMENT_STATUS.PENDING },
  },
  {
    timestamps: true,
  },
);

export const Payment = model<IPayment>("Payment", paymentSchema);
