import type { NextFunction, Request, Response } from "express";

export function errorMiddleware(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  res.status(400).json({ message: error.message || "Request failed" });
}
