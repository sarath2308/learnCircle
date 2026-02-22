import { HttpStatus } from "@/constants/shared/httpStatus";
import { NextFunction, Request, Response } from "express";
import { ZodError, ZodObject } from "zod";

export const validateRequest = (schema: ZodObject<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const shape = schema.shape;

      if (shape?.body) {
        req.body = shape.body.parse(req.body);
      }

      if (shape?.params) {
        req.params = shape.params.parse(req.params);
      }

      if (shape?.query) {
        req.query = shape.query.parse(req.query);
      }

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
