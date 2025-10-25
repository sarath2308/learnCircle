import { ZodObject } from "zod";
import { Request, Response, NextFunction } from "express";

export const zodValidation =
  (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      req.body = result.body;
      next();
    } catch (err) {
      next(err);
    }
  };
