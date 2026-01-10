import cookieParser from 'cookie-parser';
import createError from 'http-errors';
import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';

import { rateLimit } from './middlewares/rateLimit';
import { errorHandler } from './middlewares/errorMiddleware';
import { attachRequestContext } from './middlewares/authMiddleware';
import { applySecurityMiddlewares } from './middlewares/securityMiddleware';
import router from './routes';
import { dbConnect } from './db';
import { config } from './config';

dotenv.config();
const app = express();

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

const { serverConfig } = config;

export async function main() {
  const isConnected = await dbConnect();
  if (isConnected) app.listen(serverConfig.port, () => console.log(`Server is running on port ${serverConfig.port}`));
  else console.error('Failed to connect to MongoDB');
}

main();