import mongoose, { Schema, Document, Types } from "mongoose";

export interface IPendingSignup extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  passwordHash?: string;
  role: "learner" | "professional" | "admin";
}

const UserSchema = new Schema<IPendingSignup>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String },
    role: { type: String, enum: ["learner", "professional", "admin"], required: true },
  },
  { timestamps: true },
);

export const PendingSignup = mongoose.model<IPendingSignup>("PendingSignup", UserSchema);
