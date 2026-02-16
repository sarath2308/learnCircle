import z from "zod";
import { CreateReviewBodySchema } from "../review..create.body.schema";

const Params = z.object({
  courseId: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid courseId"),
});
export const CreateCourseReviewSchema = z.object({
  body: CreateReviewBodySchema,
  params: Params,
});
