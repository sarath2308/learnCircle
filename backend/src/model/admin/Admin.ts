import { Schema, model, Document, Types } from "mongoose";

export type AdminRole = "superAdmin" | "courseManager" | "userManager" | "contentManager";

export interface IAdmin extends Document {
  _id: Types.ObjectId;
  email: string;
  name: string;
  passwordHash?: string;
  googleId?: string;
  roles: AdminRole[]; // array of roles
  joinedAt?: Date;
  lastLogin?: Date;
  isBlocked?: boolean;
}

const adminSchema = new Schema<IAdmin>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    passwordHash: { type: String },
    googleId: { type: String, default: "" },
    roles: {
      type: [String],
      enum: ["superAdmin", "courseManager", "userManager", "contentManager"],
      default: ["courseManager"],
      required: true,
    },
    joinedAt: { type: Date, default: Date.now },
    lastLogin: { type: Date },
    isBlocked: { type: Boolean, default: false },
  },
  {
    timestamps: true, // manages createdAt and updatedAt
  },
);

export const Admin = model<IAdmin>("Admins", adminSchema);
