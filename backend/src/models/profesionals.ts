import mongoose, { Schema, Document } from "mongoose";

interface ProfileInfo {
  bio?: string;
  companyName?: string;
  experience?: number;
  rating?: string;
  resume?: string;
  sessionPrice?: string;
  skills?: string;
  status?: string;
  title?: string;
  totalSessions?: string;
  typesOfSessions?: string[];
}

export interface IProfessional extends Document {
  name: string;
  email: string;
  passwordHash?: string;
  profileImg?: string;
  joinedAt?: Date;
  isBlocked: boolean;
  ProfileInfo: ProfileInfo;
  RejectReason?: string;
  role: string;
  googleId?: string;
}

// Mongoose Schema
const ProfileInfoSchema = new Schema<ProfileInfo>({
  bio: { type: String },
  companyName: { type: String },
  experience: { type: Number },
  rating: { type: String },
  resume: { type: String },
  sessionPrice: { type: String },
  skills: { type: String },
  status: { type: String },
  title: { type: String },
  totalSessions: { type: String },
  typesOfSessions: [{ type: String }],
});

const ProfessionalSchema: Schema = new Schema<IProfessional>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String },
  profileImg: { type: String },
  joinedAt: { type: Date, default: Date.now },
  isBlocked: { type: Boolean, default: false },
  ProfileInfo: { type: ProfileInfoSchema, default: {} },
  RejectReason: { type: String },
  role: { type: String, default: "Professional" },
  googleId: { type: String },
});

// Export model
const Professional = mongoose.model<IProfessional>("Professional", ProfessionalSchema);

export default Professional;
