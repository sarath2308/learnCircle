import { Schema, model, Document, Types } from "mongoose";

export interface IResource extends Document {
  courseId: Types.ObjectId;
  lessonId?: Types.ObjectId;
  userId: Types.ObjectId;
  type: "YouTube" | "Blog" | "Article" | "Tool";
  title: string;
  link: string;
  status: "pending" | "approved" | "rejected";
  rejectReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ResourceSchema = new Schema<IResource>(
  {
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    lessonId: { type: Schema.Types.ObjectId, ref: "Lesson" },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["YouTube", "Blog", "Article", "Tool"],
      required: true,
    },
    title: { type: String, required: true },
    link: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejectReason: String,
  },
  { timestamps: true },
);

export const SuggestedResource = model<IResource>("Resource", ResourceSchema);
