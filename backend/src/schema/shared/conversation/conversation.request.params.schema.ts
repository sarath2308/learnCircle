import z from "zod";

const params = z.object({
  courseId: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid courseId"),
});

export const GetConversationSchema = z.object({
  params: params,
});
