import { z } from "zod";

/**
 * Public schema — what you send to frontend
 */
export const AdminLearnerSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  email: z.string().email(),
  status: z.string(),
  role: z.string(),
  isBlocked: z.boolean(),
  profileUrl: z.string().url().optional().nullable(), // generated via S3
});

/**
 * Array schemas
 */
export const AdminLearnerArraySchema = z.array(AdminLearnerSchema);
export type AdminLearnerArrayDTO = z.infer<typeof AdminLearnerArraySchema>;
