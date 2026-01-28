import { Document, model, Schema, Types } from "mongoose";

export interface IConversationParticipant extends Document {
  _id: Types.ObjectId;
  conversationId: Types.ObjectId;
  userId: Types.ObjectId;
  lastReadAt: Date;
}

const conversationParticipantSchema = new Schema<IConversationParticipant>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    lastReadAt: {
      type: Date,
      default: new Date(0), // epoch → everything unread initially
    },
  },
  { timestamps: true },
);

conversationParticipantSchema.index({ conversationId: 1, userId: 1 }, { unique: true });

export const ConversationParticipant = model(
  "ConversationParticipant",
  conversationParticipantSchema,
);
