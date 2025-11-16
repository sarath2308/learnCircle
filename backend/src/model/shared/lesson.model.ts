import { Schema, model, Document, Types } from "mongoose";

export interface ILesson extends Document {
  courseId: Types.ObjectId;
  title: string;
  description?: string;
  type: "Video" | "PDF" | "Article" | "YouTube" | "Blog";
  file_key: string;
  link?: string;
  thumbnail_key?: string;
  order: number;
  duration?: number;
  createdAt: Date;
  updatedAt: Date;
}

const lessonSchema = new Schema<ILesson>(
  {
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    title: { type: String, required: true },
    description: String,
    type: {
      type: String,
      enum: ["Video", "PDF", "Article", "YouTube", "Blog"],
      required: true,
    },
    file_key: String,
    link: String,
    thumbnail_key: String,
    duration: Number,
  },
  { timestamps: true },
);

export const Lesson = model<ILesson>("Lesson", lessonSchema);
