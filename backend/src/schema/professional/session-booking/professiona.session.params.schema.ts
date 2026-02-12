import z from "zod";

export const ProfessionalSessionBookingParamsSchema = z.object({
  params: z.object({
    sessionId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid session ID format"),
  }),
});
