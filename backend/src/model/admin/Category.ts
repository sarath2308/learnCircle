import { Schema, model, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  description?: string;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Category = model<ICategory>("Category", CategorySchema);
