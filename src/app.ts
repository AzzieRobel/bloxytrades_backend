import cookieParser from 'cookie-parser';
import createError from 'http-errors';
import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';

import { errorHandler } from './middlewares/errorMiddleware';
import { attachRequestContext } from './middlewares/authMiddleware';
import { rateLimit } from './middlewares/rateLimit';
import { applySecurityMiddlewares } from './middlewares/securityMiddleware';
import { logger } from './utils/logger';
import router from './routes';
import { dbConnect } from './db';
import { config } from './config';

dotenv.config();
const app = express();
const { port } = config;

applySecurityMiddlewares(app);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(rateLimit);
app.use(attachRequestContext);

app.use('/api', router);

app.use('*', (req, _res, next) => {
  next(createError(404, 'Route not found'));
});

app.use(errorHandler);

export async function main() {
  const isConnected = await dbConnect();
  if (isConnected) {
    // Seed database with mockup data
    const { seedListings } = await import('./utils/seedData');
    await seedListings();
    
    app.listen(port, () => logger.info(`Server is running on port ${port}`));
  } else {
    logger.error('Failed to connect to MongoDB');
  }
}

main();

export default app;
