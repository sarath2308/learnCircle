import z from "zod";

export const LearnerProfessionalsRequestSchema = z.object({
  query: z.object({
    search: z.string(),
    page: z.coerce.number(),
  }),
});
