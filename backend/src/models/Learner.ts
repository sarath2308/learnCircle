import { Schema, model, Document } from "mongoose";

export interface ILearner extends Document {
  email: string;
  joinedAt: Date;
  lastLogin?: Date;
  profileImg?: string;
  name: string;
  passwordHash: string;
  isBlocked: boolean;
  currentSubject: string[];
  role: string;
}

const learnerSchema = new Schema<ILearner>(
  {
    email: { type: String, required: true, unique: true },
    joinedAt: { type: Date, default: Date.now },
    lastLogin: { type: Date },
    profileImg: { type: String },
    name: { type: String, required: true },
    passwordHash: { type: String, required: true },
    isBlocked: { type: Boolean, default: false },
    currentSubject: { type: [String], default: [] },
    role: { type: String, required: true,default:'learner', enum: ["learner", "professional", "admin"] },
  },
  {
    timestamps: true, // automatically manages createdAt, updatedAt
  }
);

export const Learner = model<ILearner>("Learners", learnerSchema);
