import z from "zod";

const bodySchema = z.object({
  otp: z.string(),
});

export const ProfessionalProfileVerifyOtp = z.object({
  body: bodySchema,
});
