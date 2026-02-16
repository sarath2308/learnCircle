import { Document, model, Schema, Types } from "mongoose";

export interface ICourseReview extends Document {
  _id: Types.ObjectId;
  courseId: Types.ObjectId;
  learnerId: Types.ObjectId;
  rating: number;
  isDeleted: boolean;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const courseReviewSchema = new Schema<ICourseReview>(
  {
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    learnerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const CourseReviewModel = model<ICourseReview>("CourseReview", courseReviewSchema);
