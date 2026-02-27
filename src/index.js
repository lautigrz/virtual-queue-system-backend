import express from 'express';
import { AppRoutes } from './routes/routes.js';
import dotenv from 'dotenv';

import { addProcessJob } from './worker/event-queue.js';
import { redis } from './config/redis-client.js';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:4200' }));
app.use(express.json());
app.use(AppRoutes.routes);

const main = async () => {
  redis.connect();
  console.log('Connected to Redis');
  const PORT = Number(process.env.PORT) || 3000;
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  await addProcessJob();

};

main();


