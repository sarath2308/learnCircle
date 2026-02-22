import { Document, model, Schema, Types } from "mongoose";

export interface IConversation extends Document {
  _id: Types.ObjectId;
  courseId: Types.ObjectId;
  learnerId: Types.ObjectId;
  instructorId: Types.ObjectId;
  createdAt: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    learnerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    instructorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  },
);

export const Conversation = model<IConversation>("Conversation", conversationSchema);
