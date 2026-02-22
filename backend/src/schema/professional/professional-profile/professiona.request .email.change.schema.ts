import z from "zod";

const bodySchema = z.object({
  newEmail: z.string(),
});

export const ProfessionalProfileRequestEmailChangeSchema = z.object({
  body: bodySchema,
});
