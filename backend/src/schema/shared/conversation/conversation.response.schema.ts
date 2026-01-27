import z from "zod";

export const ConversationResponseSchema = z.object({
  id: z.string(),
  learnerId: z.string(),
  instructorId: z.string(),
  courseId: z.string(),
});

export type ConversationResponseType = z.infer<typeof ConversationResponseSchema>;
