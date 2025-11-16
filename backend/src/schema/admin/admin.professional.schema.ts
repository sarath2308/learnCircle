import { z } from "zod";

/**
 * Public schema (used for frontend)
 * Keys are stripped; only safe fields and generated URLs remain.
 */
export const AdminProfessionalSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  userId: z.string(),
  status: z.string().optional().nullable(),
  state: z.string(),
  role: z.string(),
  isBlocked: z.boolean(),
  rating: z.number().optional().nullable(),
  totalSessions: z.number().optional().nullable(),
  profileUrl: z.string().url().optional().nullable(),
  resumeUrl: z.string().url().optional().nullable(),
});

/**
 * Array schemas
 */
export const AdminProfessionalArraySchema = z.array(AdminProfessionalSchema);

/**
 * Types
 */
export type AdminProfessionalDTO = z.infer<typeof AdminProfessionalSchema>;
export type AdminProfessionalArrayDTO = z.infer<typeof AdminProfessionalArraySchema>;
