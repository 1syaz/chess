import { NextFunction, Request, Response } from "express";
import { ApiErrorResponse } from "../utils/ApiErrorResponse";

export function errorMiddleware(
  err: Error | ApiErrorResponse,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ApiErrorResponse) {
    console.log(err);
    return res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
      errors: err.errors,
    });
  } else {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: err.message || "An unexpected error occured.",
    });
  }
}
