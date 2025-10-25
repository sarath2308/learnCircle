import mongoose, { Schema, Document, Types } from "mongoose";

export interface IProfessionalProfile extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  RejectReason?: string;
  status?: string;
  bio?: string;
  companyName?: string;
  experience?: number;
  profile_key?: string;
  rating?: number;
  resume_key?: string;
  sessionPrice?: number;
  skills?: string[];
  title?: string;
  totalSessions?: number;
  typesOfSessions?: string[];
}

const ProfessionalSchema: Schema = new Schema<IProfessionalProfile>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    RejectReason: { type: String },
    status: { type: String, default: "pending" },
    bio: { type: String },
    companyName: { type: String },
    experience: { type: Number, required: true },
    profile_key: { type: String, required: true },
    rating: { type: Number, default: 0 },
    resume_key: { type: String, required: true },
    sessionPrice: { type: Number },
    skills: [{ type: String }],
    title: { type: String },
    totalSessions: { type: Number, default: 0 },
    typesOfSessions: [{ type: String }],
  },
  { timestamps: true },
);

const ProfessionalProfile = mongoose.model<IProfessionalProfile>(
  "ProfessionalProfile",
  ProfessionalSchema,
);

export default ProfessionalProfile;
