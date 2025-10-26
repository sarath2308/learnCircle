import { ZodObject, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";

export const zodValidation =
  (schema: ZodObject<any>) => (req: Request, res: Response, next: NextFunction) => {
    try {
      // Only validate req.body
      const validatedData = schema.parse(req.body);
      req.body = validatedData; // replace with validated data
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "validation error",
          errors: error.issues,
        });
      }
      next(error);
    }
  };
