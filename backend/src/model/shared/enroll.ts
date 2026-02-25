import { Document, model, Schema, Types } from "mongoose";

export interface IEnroll extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  courseId: Types.ObjectId;
  paymentId: Types.ObjectId;
  status: "ACTIVE" | "REVOKED";
  isEnrolled: boolean;
  enrolledAt: Date;
}

const EnrollmentSchema = new Schema<IEnroll>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    paymentId: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
      required: false, // null for free courses
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "REVOKED"],
      default: "ACTIVE",
    },
  },
  { timestamps: true },
);

// 🚨 CRITICAL: prevent duplicate enrollments
EnrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export const Enrollment = model("Enrollment", EnrollmentSchema);
