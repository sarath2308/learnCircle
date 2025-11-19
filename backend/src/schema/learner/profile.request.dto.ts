import { z } from "zod";

export const UpdateProfilePhotoSchema = z.object({
  body: z.object({
    avatar: z
      .object({
        originalname: z.string(),
        mimetype: z.string(),
        buffer: z.instanceof(Buffer),
      })
      .optional(),
  }),
});

/**
 * POST /email/change/request-otp
 */
export const RequestEmailChangeOtpSchema = z.object({
  body: z.object({
    newEmail: z.string().email("Invalid email format"),
  }),
});

/**
 * POST /email/change/verify-otp
 */
export const VerifyEmailChangeOtpSchema = z.object({
  body: z.object({
    otp: z.string().min(4, "OTP must be at least 4 digits long"),
  }),
});

/**
 * PATCH /profile/name
 */
export const UpdateNameSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
  }),
});

/**
 * PATCH /profile/password
 */
export const UpdatePasswordSchema = z.object({
  body: z.object({
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters")
      .refine((val) => /[A-Z]/.test(val), {
        message: "New password must contain at least one uppercase letter",
      }),
    password: z.string().min(6, "Password must be at least 6 characters").optional(),
  }),
});

/**
 * Export all schemas together for convenience
 */
export const LearnerProfileSchemas = {
  updateProfilePhoto: UpdateProfilePhotoSchema,
  requestEmailChangeOtp: RequestEmailChangeOtpSchema,
  verifyEmailChangeOtp: VerifyEmailChangeOtpSchema,
  updateName: UpdateNameSchema,
  updatePassword: UpdatePasswordSchema,
};

// Export type inference helpers (optional but useful)
export type UpdateProfilePhotoInput = z.infer<typeof UpdateProfilePhotoSchema>;
export type RequestEmailChangeOtpInput = z.infer<typeof RequestEmailChangeOtpSchema>;
export type VerifyEmailChangeOtpInput = z.infer<typeof VerifyEmailChangeOtpSchema>;
export type UpdateNameInput = z.infer<typeof UpdateNameSchema>;
export type UpdatePasswordInput = z.infer<typeof UpdatePasswordSchema>;
