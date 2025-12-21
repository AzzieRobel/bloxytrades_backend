import cookieParser from 'cookie-parser';
import createError from 'http-errors';
import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Load environment variables BEFORE importing config
dotenv.config();

import { errorHandler } from './middlewares/errorMiddleware';
import { attachRequestContext } from './middlewares/authMiddleware';
import { rateLimit } from './middlewares/rateLimit';
import { applySecurityMiddlewares } from './middlewares/securityMiddleware';
import { logger } from './utils/logger';
import router from './routes';
import { dbConnect } from './db';
import { config } from './config';
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
    // const { seedListings } = await import('./utils/seedData');
    // await seedListings();
    
    // Verify Resend configuration
    if (config.resendApiKey) {
      logger.info(`Resend email service configured (API key: ${config.resendApiKey.substring(0, 10)}...)`);
      logger.info(`From email: ${config.resendFromEmail}`);
    } else {
      logger.warn('⚠️  Resend API key not configured. Email verification will not work.');
      logger.warn('   Please set RESEND_API_KEY in your .env file');
    }
    
    app.listen(port, () => logger.info(`Server is running on port ${port}`));
  } else {
    logger.error('Failed to connect to MongoDB');
  }
}

main();

export default app;
