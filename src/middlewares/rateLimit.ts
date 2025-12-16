import { NextFunction, Request, Response } from 'express';

export const rateLimit = (_req: Request, _res: Response, next: NextFunction) => {
  // Placeholder for real rate limiting (e.g., Redis-based).
  next();
};

