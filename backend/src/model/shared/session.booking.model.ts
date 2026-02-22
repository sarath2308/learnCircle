import { Schema, model, Types, Document } from "mongoose";

export type BookingStatus = "pending" | "confirmed" | "cancelled";

export interface ISessionBooking extends Document {
  _id: Types.ObjectId;
  instructorId: Types.ObjectId;
  learnerId: Types.ObjectId;

  date: Date;
  startTime: string;
  endTime: string;

  price: number;

  status: BookingStatus;
  typeOfSession: string;

  expiresAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const SessionBookingSchema = new Schema<ISessionBooking>(
  {
    instructorId: { type: Schema.Types.ObjectId, required: true, index: true },
    learnerId: { type: Schema.Types.ObjectId, required: true, index: true },

    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },

    price: { type: Number, required: true },
    typeOfSession: { type: String, required: true },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
      index: true,
    },

    expiresAt: { type: Date },
  },
  { timestamps: true },
);

SessionBookingSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 600 });

SessionBookingSchema.index(
  { instructorId: 1, date: 1, startTime: 1, endTime: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: { $in: ["pending", "confirmed"] },
    },
  },
);

export const SessionBookingModel = model<ISessionBooking>("SessionBooking", SessionBookingSchema);
