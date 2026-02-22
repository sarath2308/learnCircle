import { Document, model, Schema, Types } from "mongoose";

export interface IEnroll extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  courseId: Types.ObjectId;
  isEnrolled: boolean;
  enrollerAt: Date;
}

const enrollSchema = new Schema<IEnroll>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    isEnrolled: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Enroll = model<IEnroll>("Enroll", enrollSchema);
