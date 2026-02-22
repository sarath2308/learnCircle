import z from "zod";

export const NotificationResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  message: z.string(),
  isRead: z.boolean(),
});

export type NotificationResponseType = z.infer<typeof NotificationResponseSchema>;
