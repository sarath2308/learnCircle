import z from "zod";
import { CreateReviewBodySchema } from "../review..create.body.schema";

const Params = z.object({
  instructorId: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid instructorId"),
});
export const CreateInstructorReviewSchema = z.object({
  body: CreateReviewBodySchema,
  params: Params,
});
