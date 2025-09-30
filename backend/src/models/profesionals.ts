import mongoose, { Schema, Document, Types } from "mongoose";

export interface ProfileInfo {
  bio?: string;
  companyName?: string;
  experience?: number;
  rating?: string;
  resumeId?: string;
  sessionPrice?: string;
  skills?: string;
  title?: string;
  totalSessions?: string;
  typesOfSessions?: string[];
}

export interface IProfessional extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  passwordHash?: string;
  publicId?: string;
  joinedAt?: Date;
  isBlocked: boolean;
  profileInfo: ProfileInfo;
  RejectReason?: string;
  role: string;
  googleId?: string;
  status?: string;
}

// Mongoose Schema
const ProfileInfoSchema = new Schema<ProfileInfo>({
  bio: { type: String },
  companyName: { type: String },
  experience: { type: Number },
  rating: { type: String },
  resumeId: { type: String },
  sessionPrice: { type: String },
  skills: { type: String },
  title: { type: String },
  totalSessions: { type: String },
  typesOfSessions: [{ type: String }],
});

const ProfessionalSchema: Schema = new Schema<IProfessional>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String },
  publicId: { type: String },
  joinedAt: { type: Date, default: Date.now },
  isBlocked: { type: Boolean, default: false },
  profileInfo: { type: ProfileInfoSchema, default: {} },
  RejectReason: { type: String },
  role: { type: String, default: "profesional" },
  status: { type: String, default: "pending" },
  googleId: { type: String },
});

// Export model
const Professional = mongoose.model<IProfessional>("Professional", ProfessionalSchema);

export default Professional;
