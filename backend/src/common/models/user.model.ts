// models/User.ts
import mongoose, { Schema, Document, Types } from "mongoose";

interface AuthProvider {
  provider: "google" | "github" | "facebook" | "linkedin";
  providerId: string;
  accessToken?: string;
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  passwordHash?: string;
  providers?: AuthProvider[];
  role: "learner" | "professional" | "admin";
  isBlocked: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const ProviderSchema = new Schema<AuthProvider>(
  {
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
  },
  { _id: false },
);

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String },
    providers: { type: [ProviderSchema], default: [] },
    role: { type: String, enum: ["learner", "professional", "admin"], required: true },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const User = mongoose.model<IUser>("User", UserSchema);
