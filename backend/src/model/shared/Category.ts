import { Schema, model, Document, Types } from "mongoose";

export interface ICategory extends Document {
  _id: Types.ObjectId;
  name: string;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Category = model<ICategory>("Category", CategorySchema);
