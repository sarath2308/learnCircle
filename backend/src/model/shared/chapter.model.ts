import { model, Schema, Types, Document } from "mongoose";

export interface IChapter extends Document {
  courseId: Types.ObjectId;
  title: string;
  description: string;
  order: number;
  isPublished: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ChapterSchema = new Schema<IChapter>(
  {
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    order: { type: Number, required: true },
    isPublished: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Chapter = model<IChapter>("Chapter", ChapterSchema);
