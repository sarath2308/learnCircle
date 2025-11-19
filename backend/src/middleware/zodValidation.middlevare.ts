import { HttpStatus } from "@/constants/shared/httpStatus";
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export const validateRequest = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema.body) req.body = schema.body.parse(req.body);
      if (schema.params) req.params = schema.params.parse(req.params);
      if (schema.query) req.query = schema.query.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "validation error",
          errors: error.issues,
        });
      }
      next(error);
    }
  };
};
