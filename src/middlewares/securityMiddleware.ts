import { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import hpp from 'hpp';

export const applySecurityMiddlewares = (app: Express) => {
  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({ origin: true, credentials: true }));
  app.use(hpp());
};

