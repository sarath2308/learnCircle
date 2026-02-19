import { z } from "zod";

export const ProfessionalProfileResponseSchema = z.object({
  id: z.string().uuid(), // or ObjectId regex if Mongo
  name: z.string().min(1).max(100),
  email: z.string().email(),
  bio: z.string().min(1).max(1000),
  skills: z.array(z.string()),
  title: z.string().min(1).max(100),
  typeOfSession: z.array(z.string()),
});

export type ProfessionalProfileResponseType = z.infer<typeof ProfessionalProfileResponseSchema>;
