import { Providers } from "@/common/constants/providers";
import { z } from "zod";

// ----------------- Base User Schemas -----------------
export const AuthProviderSchema = z.object({
  provider: z.enum(Providers),
  providerId: z.string(),
});

export const UserBaseSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email"),
  passwordHash: z.string().optional(),
  providers: z.array(AuthProviderSchema).optional(),
  role: z.enum(["learner", "professional", "admin"]),
  isBlocked: z.boolean().default(false),
});

// ----------------- Request Schemas -----------------

// Signup request
export const SignupRequestSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(["learner", "professional", "admin"]),
  }),
});

// Verify OTP for signup
export const VerifySignupOtpSchema = z.object({
  body: z.object({
    email: z.string().email(),
    otp: z.string().min(4),
    token: z.string(),
  }),
});

// Resend signup OTP
export const ResendSignupOtpSchema = z.object({
  body: z.object({
    token: z.string(),
  }),
});

// Login (email/password or provider)
export const LoginRequestSchema = z
  .object({
    body: z.object({
      email: z.string().email().optional(),
      password: z.string().min(6).optional(),
      provider: z.enum(["google", "github", "facebook", "linkedin"]).optional(),
      providerId: z.string().optional(),
      role: z.enum(["learner", "professional", "admin"]).optional(),
    }),
  })
  .refine(
    (data) =>
      (data.body.email && data.body.password) || (data.body.provider && data.body.providerId),
    { message: "Either email/password or provider/providerId is required" },
  );

// Forgot password
export const ForgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email(),
    role: z.enum(["learner", "professional", "admin"]).optional(),
  }),
});

// Resend forgot OTP
export const ResendForgotOtpSchema = z.object({
  body: z.object({
    email: z.string().email(),
    role: z.enum(["learner", "professional", "admin"]).optional(),
  }),
});

// Verify forgot OTP
export const VerifyForgotOtpSchema = z.object({
  body: z.object({
    email: z.string().email(),
    otp: z.string().min(4),
    role: z.enum(["learner", "professional", "admin"]).optional(),
  }),
});

// Reset password
export const ResetPasswordSchema = z.object({
  body: z.object({
    email: z.string().email(),
    token: z.string(),
    newPassword: z.string().min(6),
    role: z.enum(["learner", "professional", "admin"]).optional(),
  }),
});

// Google OAuth login
export const GoogleLoginSchema = z.object({
  body: z.object({
    token: z.string().min(1, "Google token is required"),
    role: z.enum(["learner", "professional", "admin"]).optional(),
  }),
});

// ----------------- Response Schemas -----------------

export const UserResponseSchema = z.object({
  _id: z.string(),
  name: z.string(),
  email: z.string(),
  role: z.enum(["learner", "professional", "admin"]),
  isBlocked: z.boolean(),
  providers: z
    .array(
      z.object({
        provider: z.enum(["google", "github", "facebook", "linkedin"]),
      }),
    )
    .optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// ----------------- Types -----------------
export type SignupRequestDto = z.infer<typeof SignupRequestSchema>["body"];
export type VerifySignupOtpDto = z.infer<typeof VerifySignupOtpSchema>["body"];
export type ResendSignupOtpDto = z.infer<typeof ResendSignupOtpSchema>["body"];
export type LoginRequestDto = z.infer<typeof LoginRequestSchema>["body"];
export type ForgotPasswordDto = z.infer<typeof ForgotPasswordSchema>["body"];
export type ResendForgotOtpDto = z.infer<typeof ResendForgotOtpSchema>["body"];
export type VerifyForgotOtpDto = z.infer<typeof VerifyForgotOtpSchema>["body"];
export type ResetPasswordDto = z.infer<typeof ResetPasswordSchema>["body"];
export type GoogleLoginDto = z.infer<typeof GoogleLoginSchema>["body"];
export type UserResponseDto = z.infer<typeof UserResponseSchema>;
