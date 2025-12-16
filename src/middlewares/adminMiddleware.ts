import { NextFunction, Request, Response } from 'express';

// Placeholder: with roles removed, this currently passes through.
// Implement allowlisting or another mechanism if admin separation is required.
export const requireAdmin = (_req: Request, _res: Response, next: NextFunction) => next();

