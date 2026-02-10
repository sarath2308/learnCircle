import z from "zod";

export const SessionBookingConfirmSchema = z.object({
  params: z.object({
    bookingId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid booking ID format"),
  }),
});
