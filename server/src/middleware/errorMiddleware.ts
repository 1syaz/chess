import { NextFunction, Request, Response } from "express";
import { ApiErrorResponse } from "../utils/ApiErrorResponse";

export function errorMiddleware(
  err: Error | ApiErrorResponse,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ApiErrorResponse) {
    return res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
      errors: err.errors,
    });
  } else {
    return res.status(500).json({
      success: false,
      message: err.message || "An unexpected error occured.",
    });
  }
}
