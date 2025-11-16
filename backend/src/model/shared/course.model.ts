import { Schema, model, Document, Types } from "mongoose";

export interface ICourse extends Document {
  title: string;
  description: string;
  category: string;
  skillLevel: "Beginner" | "Intermediate" | "Advanced";
  thumbnail_key: string;
  price?: number;
  discount?: number;
  type: "Free" | "Paid";
  createdBy: Types.ObjectId;
  status: "draft" | "pending" | "approved" | "rejected" | "published";
  rejectReason?: string;
  lessonCount?: number;
  totalDuration?: number;
  averageRating?: number;
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    skillLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    thumbnail_key: String,
    price: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    type: { type: String, enum: ["Free", "Paid"], default: "Free" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["draft", "pending", "approved", "rejected", "published"],
      default: "draft",
    },
    rejectReason: String,
    lessonCount: { type: Number, default: 0 },
    totalDuration: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const Course = model<ICourse>("Course", courseSchema);
