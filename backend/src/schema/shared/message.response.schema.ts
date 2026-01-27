import z from "zod";

export const MessageResponseSchema = z.object({
  id: z.string(),
  conversationId: z.string(),
  senderId: z.string(),
  receiverId: z.string(),
  content: z.string(),
  createdAt: z.string(),
  isSender: z.boolean(),
});

export type MessageResponseType = z.infer<typeof MessageResponseSchema>;
