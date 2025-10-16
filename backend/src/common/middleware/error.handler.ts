import { Request, Response } from "express";
import { AppError, HttpStatus, Messages } from "@/common";

export function errorHandler(err: any, req: Request, res: Response) {
  console.error(`[ERROR] ${req.method} ${req.url}`, err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: Messages.SERVER_ERROR,
  });
}
