import { redis } from "../config/redis-client.js";

const client = redis.connect();
export class QueueService {

    async addToQueue(userId) {

        const add = await client.zadd('waiting_queue', 'NX', Date.now(), userId);

        const userPosition = await client.zrank('waiting_queue', userId);
        await client.set(`initial_ahead:${userId}`, userPosition, 'NX');

        return add;

    }


    async getStatus(userId) {

        const userExists = await client.zscore('active_sessions', userId);

        if (userExists) return { userId: userId, redirect: '/purchase' }

        const userPosition = await client.zrank('waiting_queue', userId);

        console.log(`position in queue: ${userPosition}`);

        if (userPosition === null) return { status: 'not_in_queue' };

        const [queueSize, progress] = await Promise.all([
            client.zcard('waiting_queue'),
            this.calculateProgress(userId, userPosition)
        ]);

        const status = {
            status: 'in_queue',
            position: userPosition + 1,
            queueSize: queueSize,
            ahead: userPosition,
            progress: progress
        }

        return status;

    }


    async calculateProgress(userId, currentAhead) {
        const p = await client.get(`initial_ahead:${userId}`);

        if (p === null) return 0;

        const initialAhead = parseInt(p);

        if (initialAhead === 0) return 100;

        const progressed = ((initialAhead - currentAhead) / initialAhead) * 100;

        return Math.max(0, Math.min(100, Math.round(progressed)));

    }
}

