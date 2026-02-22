// models/Subcategory.ts
import { Schema, model, Document, Types } from "mongoose";

export interface ISubcategory extends Document {
  name: string;
  description?: string;
  categoryId: Types.ObjectId; // reference to parent category
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SubcategorySchema = new Schema<ISubcategory>(
  {
    name: { type: String, required: true },
    description: { type: String },
    isBlocked: { type: Boolean, default: false },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  },
  { timestamps: true },
);

export const Subcategory = model<ISubcategory>("SubCategory", SubcategorySchema);
