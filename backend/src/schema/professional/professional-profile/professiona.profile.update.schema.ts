import z from "zod";

const bodySchema = z.object({
  name: z.string().optional(),
  title: z.string().optional(),
  companyName: z.string().optional(),
  experience: z.number().optional(),
  bio: z.string().optional(),
});

export const ProfessionalProfileUpdateSchema = z.object({
  body: bodySchema,
});

export type ProfessionalProfileUpdateType = z.infer<typeof bodySchema>;
