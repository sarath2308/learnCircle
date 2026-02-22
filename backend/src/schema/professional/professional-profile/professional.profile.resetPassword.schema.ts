import z from "zod";

const bodySchema = z.object({
  oldPassword: z.string(),
  newPassword: z.string(),
});

export const ProfessionalPasswordResetSchema = z.object({
  body: bodySchema,
});
