import { Schema, model, Document, Types } from "mongoose";

export interface ILearnerProfile extends Document {
  _id: Types.ObjectId;
  profile_key?: string;
  currentSubject?: string[];
  streak: Number;
  userId: Types.ObjectId;
  joinedAt: Date;
  lastLogin: Date;
  createdAt: Date; // from timestamps
  updatedAt: Date; // from timestamps
}

const learnerSchema = new Schema<ILearnerProfile>(
  {
    profile_key: { type: String },

    currentSubject: { type: [String], default: [] },
    streak: { type: Number, required: true, default: 0 },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", // references the users collection
      required: true,
    },

    joinedAt: { type: Date, default: Date.now },

    lastLogin: { type: Date, default: Date.now },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  },
);

export const LearnerProfile = model<ILearnerProfile>("LearnerProfile", learnerSchema);
