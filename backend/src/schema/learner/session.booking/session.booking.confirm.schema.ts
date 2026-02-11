import z from "zod";

export const SessionBookingParamsSchema = z.object({
  params: z.object({
    bookingId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid booking ID format"),
  }),
});
