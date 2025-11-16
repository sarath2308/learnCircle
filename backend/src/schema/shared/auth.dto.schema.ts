import { Providers } from "@/constants/shared/providers";
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
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["learner", "professional", "admin"]),
});

// Verify OTP for signup
export const VerifySignupOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().min(4),
});

// Resend signup OTP
export const ResendSignupOtpSchema = z.object({
  email: z.string(),
});

// Login (email/password or provider)
export const LoginRequestSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: z.enum(["learner", "professional", "admin"]).optional(),
});

// Forgot password
export const ForgotPasswordSchema = z.object({
  email: z.string().email(),
  role: z.enum(["learner", "professional", "admin"]).optional(),
});

// Resend forgot OTP
export const ResendForgotOtpSchema = z.object({
  email: z.string().email(),
  role: z.enum(["learner", "professional", "admin"]).optional(),
});

// Verify forgot OTP
export const VerifyForgotOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().min(4),
  role: z.enum(["learner", "professional", "admin"]).optional(),
});

// Reset password
export const ResetPasswordSchema = z.object({
  token: z.string(),
  email: z.string().email(),
  newPassword: z.string().min(6),
  role: z.enum(["learner", "professional", "admin"]).optional(),
});

// Google OAuth login
export const GoogleLoginSchema = z.object({
  token: z.string().min(1, "Google token is required"),
  role: z.enum(["learner", "professional", "admin"]).optional(),
});

// ----------------- Response Schemas -----------------

export const UserResponseSchema = z.object({
  name: z.string(),
  email: z.string(),
  role: z.enum(["learner", "professional", "admin"]),
});

// ----------------- Types -----------------
export type SignupRequestDto = z.infer<typeof SignupRequestSchema>;
export type VerifySignupOtpDto = z.infer<typeof VerifySignupOtpSchema>;
export type ResendSignupOtpDto = z.infer<typeof ResendSignupOtpSchema>;
export type LoginRequestDto = z.infer<typeof LoginRequestSchema>;
export type ForgotPasswordDto = z.infer<typeof ForgotPasswordSchema>;
export type ResendForgotOtpDto = z.infer<typeof ResendForgotOtpSchema>;
export type VerifyForgotOtpDto = z.infer<typeof VerifyForgotOtpSchema>;
export type ResetPasswordDto = z.infer<typeof ResetPasswordSchema>;
export type GoogleLoginDto = z.infer<typeof GoogleLoginSchema>;
export type UserResponseDto = z.infer<typeof UserResponseSchema>;
