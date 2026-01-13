import { Schema, model, Document, Types } from "mongoose";

export interface ICourse extends Document {
  title: string;
  description: string;
  category: Types.ObjectId;
  subCategory?: Types.ObjectId;
  skillLevel: "Beginner" | "Intermediate" | "Advanced";
  thumbnail_key: string;
  price?: number;
  discount?: number;
  type: "Free" | "Paid";
  createdBy: Types.ObjectId;
  status: "draft" | "published";
  verificationStatus: "pending" | "rejected" | "approved";
  rejectReason?: string;
  chapterCount?: number;
  totalDuration?: number;
  isDeleted: boolean;
  isBlocked: boolean;
  blockedReason: string;
  averageRating?: number;
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    subCategory: { type: Schema.Types.ObjectId, ref: "SubCategory" },
    skillLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    thumbnail_key: { type: String, default: "" },
    price: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    type: { type: String, enum: ["Free", "Paid"], default: "Free" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "rejected", "approved"],
      default: "pending",
    },
    isDeleted: { type: Boolean, default: false },
    rejectReason: { type: String },
    isBlocked: { type: Boolean },
    blockedReason: { type: String },
    chapterCount: { type: Number, default: 0 },
    totalDuration: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const Course = model<ICourse>("Course", courseSchema);
