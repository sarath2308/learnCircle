import { Schema, model, Types, Document } from "mongoose";

export type BookingStatus = "pending" | "confirmed" | "cancelled";

export interface ISessionBooking extends Document {
  _id: Types.ObjectId;
  instructorId: Types.ObjectId;
  learnerId: Types.ObjectId;

  date: string;
  startTime: string;
  endTime: string;

  price: number;

  status: BookingStatus;

  createdAt: Date;
  updatedAt: Date;
}

const SessionBookingSchema = new Schema<ISessionBooking>(
  {
    instructorId: { type: Schema.Types.ObjectId, required: true, index: true },
    learnerId: { type: Schema.Types.ObjectId, required: true, index: true },

    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },

    price: { type: Number, required: true },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
      index: true,
    },
  },
  { timestamps: true },
);

//  prevent double booking of same slot
SessionBookingSchema.index(
  { instructorId: 1, date: 1, startTime: 1, endTime: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "confirmed" },
  },
);

export const SessionBookingModel = model<ISessionBooking>("SessionBooking", SessionBookingSchema);
