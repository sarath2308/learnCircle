import { Schema, model, Types, Document } from "mongoose";

export interface IAvailabilityException extends Document {
  _id: Types.ObjectId;
  instructorId: Types.ObjectId;

  date: Date;

  createdAt: Date;
  updatedAt: Date;

  isActive: boolean;
}

const AvailabilityExceptionSchema = new Schema<IAvailabilityException>(
  {
    instructorId: { type: Schema.Types.ObjectId, required: true, index: true },

    date: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const AvailabilityExceptionModel = model<IAvailabilityException>(
  "AvailabilityException",
  AvailabilityExceptionSchema,
);
