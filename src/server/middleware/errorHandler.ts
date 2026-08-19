import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const status = (err as { status?: number }).status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    error: message,
    status,
  });
}
