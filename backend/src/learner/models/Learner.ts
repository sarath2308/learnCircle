import { Schema, model, Document, Types } from "mongoose";

export interface ILearner extends Document {
  _id: Types.ObjectId;
  email: string;
  name: string;
  role: string;
  passwordHash?: string;
  googleId?: string;
  publicId?: string;
  currentSubject?: string[];
  joinedAt?: Date;
  lastLogin?: Date;
  isBlocked?: boolean;
}
const learnerSchema = new Schema<ILearner>(
  {
    email: { type: String, required: true, unique: true },
    joinedAt: { type: Date, default: Date.now },
    lastLogin: { type: Date },
    publicId: { type: String },
    name: { type: String, required: true },
    passwordHash: { type: String },
    isBlocked: { type: Boolean, default: false },
    currentSubject: { type: [String], default: [] },
    role: {
      type: String,
      required: true,
      default: "learner",
    },
    googleId: { type: String, default: "" },
  },
  {
    timestamps: true, // automatically manages createdAt, updatedAt
  },
);

export const Learner = model<ILearner>("Learners", learnerSchema);
