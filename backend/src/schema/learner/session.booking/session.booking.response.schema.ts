import { BOOKING_STATUS } from "@/constants/shared/booking.status";
import z from "zod";

export const SessionBookingResponseSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/),
  instructorId: z.string().regex(/^[0-9a-fA-F]{24}$/),
  date: z.coerce.string(),
  startTime: z.string().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/),
  endTime: z.string().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/),
  price: z.number().positive("Price must be a positive number"),
  typeOfSession: z.string().min(1, "Type of session is required"),
  status: z.enum(BOOKING_STATUS),
});

export type SessionBookingResponseType = z.infer<typeof SessionBookingResponseSchema>;
