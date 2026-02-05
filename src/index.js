import express from 'express';
import { AppRoutes } from './routes/routes.js';
import { redis } from './config/redis-client.js';
import { processQueue } from './utils/process-queue.js';
import { clearUsuersExpired } from './utils/delete-queue.js';
import cors from 'cors';

const app = express();
app.use(cors({
  origin: 'http://localhost:4200',
}));
app.use(express.json());
app.use(AppRoutes.routes);

const main = async () => {
  await redis.connect();
  console.log('Connected to Redis');

  app.listen(3000);
  console.log('Server is running on port 3000');
  

  setInterval(() => {
    processQueue(redis.getClient())
    clearUsuersExpired(redis.getClient())
  }, 1000);

};

main();


