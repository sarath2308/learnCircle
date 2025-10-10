import { z } from "zod";

export const AuthProviderSchema = z.object({
  provider: z.enum(["google", "github", "facebook", "linkedin"]),
  providerId: z.string(),
  accessToken: z.string().optional(),
});

export const UserBaseSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email"),
  passwordHash: z.string().optional(),
  providers: z.array(AuthProviderSchema).optional(),
  role: z.enum(["learner", "professional", "admin"]),
  isBlocked: z.boolean().default(false),
});

export const CreateUserRequestSchema = UserBaseSchema.extend({
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
});

export const UpdateUserRequestSchema = UserBaseSchema.partial();

export const UserResponseSchema = UserBaseSchema.extend({
  _id: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
}).omit({ passwordHash: true });

export type AuthProviderDto = z.infer<typeof AuthProviderSchema>;
export type CreateUserRequestDto = z.infer<typeof CreateUserRequestSchema>;
export type UpdateUserRequestDto = z.infer<typeof UpdateUserRequestSchema>;
export type UserResponseDto = z.infer<typeof UserResponseSchema>;
