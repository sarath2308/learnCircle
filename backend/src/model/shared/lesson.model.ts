import { Schema, model, Document, Types } from "mongoose";

export interface ILesson extends Document {
  chapterId: Types.ObjectId;
  title: string;
  description?: string;
  type: "Video" | "PDF" | "Article" | "YouTube" | "Blog";
  file_key: string;
  link?: string;
  thumbnail_key?: string;
  isDeleted?: boolean;
  mediaStatus?: "ready" | "pending" | "uploaded" | "failed";
  order: number;
  duration?: number;
  createdAt: Date;
  updatedAt: Date;
}

const lessonSchema = new Schema<ILesson>(
  {
    chapterId: { type: Schema.Types.ObjectId, ref: "Chapter", required: true },
    title: { type: String, required: true },
    description: String,
    type: {
      type: String,
      enum: ["Video", "PDF", "Article", "YouTube", "Blog"],
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
    mediaStatus: {
      type: String,
      enum: ["ready", "pending", "uploaded", "failed"],
      default: "ready",
    },
    order: { type: Number, required: true },
    file_key: { type: String },
    link: { type: String },
    thumbnail_key: { type: String },
    duration: { type: Number },
  },
  { timestamps: true },
);

export const Lesson = model<ILesson>("Lesson", lessonSchema);
