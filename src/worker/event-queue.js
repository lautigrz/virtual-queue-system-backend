import { Queue } from 'bullmq';
import { bullConnection } from '../config/bull-connection.js';

export const eventQueue = new Queue('event-queue', {
    connection: bullConnection,
});

export const addProcessJob = async () => {
   
    await eventQueue.add(
        'process-user',
        {},
        {
            repeat: { every: Number(process.env.PROCESS_INTERVAL_MS) || 1000 },
            jobId: process.env.PROCESS_JOB_ID || 'process-user-scheduler',
            removeOnComplete: true,
            removeOnFail: false,
        }
    );

    console.log('Scheduler process-user registrado');
};