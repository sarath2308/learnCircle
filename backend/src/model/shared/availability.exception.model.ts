import { Schema, model, Types, Document } from "mongoose";

export interface IAvailabilityException extends Document {
  _id: Types.ObjectId;
  instructorId: Types.ObjectId;

  date: string;

  startTime?: string;
  endTime?: string;

  reason?: string;

  createdAt: Date;
  updatedAt: Date;
}

const AvailabilityExceptionSchema = new Schema<IAvailabilityException>(
  {
    instructorId: { type: Schema.Types.ObjectId, required: true, index: true },

    date: { type: String, required: true },

    startTime: { type: String },
    endTime: { type: String },

    reason: { type: String },
  },
  { timestamps: true },
);

// Prevent duplicate blocks for same date + time range
AvailabilityExceptionSchema.index(
  { instructorId: 1, date: 1, startTime: 1, endTime: 1 },
  { unique: true },
);

export const AvailabilityExceptionModel = model<IAvailabilityException>(
  "AvailabilityException",
  AvailabilityExceptionSchema,
);
