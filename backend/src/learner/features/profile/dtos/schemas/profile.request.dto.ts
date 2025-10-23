import { z } from "zod";

/**
 * Common Schema for authenticated user
 */
export const AuthUserSchema = z.object({
  userId: z.string().uuid("Invalid user ID format"),
});

/**
 * GET /profile
 */
export const GetProfileSchema = z.object({
  user: AuthUserSchema,
});

/**
 * PATCH /profile/photo
 */
export const UpdateProfilePhotoSchema = z.object({
  user: AuthUserSchema,
  avatar: z
    .object({
      originalname: z.string(),
      mimetype: z.string(),
      buffer: z.instanceof(Buffer),
    })
    .optional(),
});

/**
 * POST /email/change/request-otp
 */
export const RequestEmailChangeOtpSchema = z.object({
  user: AuthUserSchema,
  body: z.object({
    newEmail: z.string().email("Invalid email format"),
  }),
});

/**
 * POST /email/change/resend-otp
 */
export const ResendEmailChangeOtpSchema = z.object({
  user: AuthUserSchema,
});

/**
 * POST /email/change/verify-otp
 */
export const VerifyEmailChangeOtpSchema = z.object({
  user: AuthUserSchema,
  body: z.object({
    otp: z.string().min(4, "OTP must be at least 4 digits long"),
  }),
});

/**
 * PATCH /profile/name
 */
export const UpdateNameSchema = z.object({
  user: AuthUserSchema,
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
  }),
});

/**
 * PATCH /profile/password
 */
export const UpdatePasswordSchema = z.object({
  user: AuthUserSchema,
  body: z.object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters")
      .refine((val) => /[A-Z]/.test(val), {
        message: "New password must contain at least one uppercase letter",
      }),
  }),
});

/**
 * GET /profile/new-url
 */
export const GetNewProfileUrlSchema = z.object({
  user: AuthUserSchema,
});

/**
 * Export all schemas together for convenience
 */
export const LearnerProfileSchemas = {
  getProfile: GetProfileSchema,
  updateProfilePhoto: UpdateProfilePhotoSchema,
  requestEmailChangeOtp: RequestEmailChangeOtpSchema,
  resendEmailChangeOtp: ResendEmailChangeOtpSchema,
  verifyEmailChangeOtp: VerifyEmailChangeOtpSchema,
  updateName: UpdateNameSchema,
  updatePassword: UpdatePasswordSchema,
  getNewProfileUrl: GetNewProfileUrlSchema,
};

// Export type inference helpers (optional but useful)
export type GetProfileInput = z.infer<typeof GetProfileSchema>;
export type UpdateProfilePhotoInput = z.infer<typeof UpdateProfilePhotoSchema>;
export type RequestEmailChangeOtpInput = z.infer<typeof RequestEmailChangeOtpSchema>;
export type ResendEmailChangeOtpInput = z.infer<typeof ResendEmailChangeOtpSchema>;
export type VerifyEmailChangeOtpInput = z.infer<typeof VerifyEmailChangeOtpSchema>;
export type UpdateNameInput = z.infer<typeof UpdateNameSchema>;
export type UpdatePasswordInput = z.infer<typeof UpdatePasswordSchema>;
export type GetNewProfileUrlInput = z.infer<typeof GetNewProfileUrlSchema>;
