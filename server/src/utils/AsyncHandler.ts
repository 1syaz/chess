import { Request, Response, NextFunction } from "express";

export function AsyncHandler(
  requestHandler: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<unknown>
) {
  return (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
}
