import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';

declare module 'express-serve-static-core' {
  interface Request {
    user?: { id: string };
  }
}

export const attachRequestContext = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, config.jwtSecret) as { id: string };
      req.user = { id: decoded.id };
    } catch {
      // Invalid token: surface 401 during requireAuth
      req.user = undefined;
    }
  } else {
    req.user = { id: 'anonymous' };
  }
  next();
};

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.id === 'anonymous') {
    return res.status(401).json({ message: 'Authentication required' });
  }
  next();
};

