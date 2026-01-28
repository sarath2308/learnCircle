import z from "zod";

const paramSchema = z.object({
  conversationId: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid ConversationId"),
});

export const GetMessageSchema = z.object({
  params: paramSchema,
});
