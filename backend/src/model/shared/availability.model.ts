import { Schema, model, Types, Document } from "mongoose";

export interface IAvailability extends Document {
  _id: Types.ObjectId;
  instructorId: Types.ObjectId;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotDuration: number;
  price: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const InstructorAvailabilitySchema = new Schema<IAvailability>(
  {
    instructorId: { type: Schema.Types.ObjectId, required: true, index: true },

    dayOfWeek: { type: Number, required: true, min: 0, max: 6 },

    startTime: { type: String, required: true },
    endTime: { type: String, required: true },

    slotDuration: { type: Number, required: true },

    price: { type: Number, required: true },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const AvailabilityModel = model<IAvailability>("Availability", InstructorAvailabilitySchema);
