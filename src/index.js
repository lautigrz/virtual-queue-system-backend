import express from 'express';
import { AppRoutes } from './routes/routes.js';

import { addProcessJob } from './worker/event-queue.js';
import { redis } from "./config/redis-client.js";
import cors from 'cors';

const app = express();
app.use(cors({
  origin: 'http://localhost:4200',
}));
app.use(express.json());
app.use(AppRoutes.routes);

const main = async () => {
  redis.connect();
  console.log('Connected to Redis');

  app.listen(3000);
  await addProcessJob();
  console.log('Server is running on port 3000');
  
};

main();


