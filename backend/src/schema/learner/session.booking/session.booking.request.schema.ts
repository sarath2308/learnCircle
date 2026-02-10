import z from "zod";

export const SessionBookingRequestSchema = z.object({
  instructorId: z.string().regex(/^[0-9a-fA-F]{24}$/),
  learnerId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional(),
  date: z.coerce.date(),
  startTime: z.string().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/),
  endTime: z.string().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/),
  price: z.number().positive("Price must be a positive number"),
  typeOfSession: z.string().min(1, "Type of session is required"),
});

export type SessionBookingRequestType = z.infer<typeof SessionBookingRequestSchema>;
