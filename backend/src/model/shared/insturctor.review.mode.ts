import { Document, model, Schema, Types } from "mongoose";

export interface IInstructorReview extends Document {
  _id: Types.ObjectId;
  instructorId: Types.ObjectId;
  learnerId: Types.ObjectId;
  rating: number;
  isDeleted: boolean;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InstructorReviewSchema = new Schema<IInstructorReview>(
  {
    instructorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    learnerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

InstructorReviewSchema.index({ instructorId: 1, learnerId: 1 }, { unique: true });

export const InstructorReviewModel = model<IInstructorReview>(
  "InstructorReview",
  InstructorReviewSchema,
);
