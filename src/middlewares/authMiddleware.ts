import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { config } from '../config';

const { serverConfig } = config;

declare module 'express-serve-static-core' {
  interface Request {
    user?: { id: string };
  }
}

export const attachRequestContext = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, serverConfig.jwtSecret) as { id: string };
      req.user = { id: decoded.id };
    } catch {
    // leave req.user undefined; requireAuth will enforce auth where needed
      req.user = undefined;
  }
  next();
};

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
    }
  return next();
};

