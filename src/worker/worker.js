import { Worker } from 'bullmq';
import { processQueue } from '../utils/process-queue.js';
import { clearUsuersExpired } from '../utils/delete-queue.js';
import { bullConnection } from '../config/bull-connection.js';
import { redis } from '../config/redis-client.js';

const client = redis.connect();

const worker = new Worker('event-queue', async job => {
  try {
    if (job.name === 'process-user') {
      console.log('Processing queue...');
      await processQueue(client);
    } else if (job.name === 'release') {
      console.log('Processing release...');
      await clearUsuersExpired(client, job.data.userId);
    }

    console.log('processQueue finished');
  } catch (err) {
    console.error('Error en worker:', err);
    throw err;
  }
}, {
  connection: bullConnection,
  concurrency: 1,
});


const shutdown = async () => {
  console.log('Shutting down worker...');
  await worker.close();
  try { await client.quit(); } catch (e) { }
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
