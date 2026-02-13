import { eventQueue } from "../worker/event-queue.js";

const CAPACITY = 5;

const SESSION_TTL = 10000;


export async function processQueue(clientRedis) {

    while (true) {
        const next = await clientRedis.zpopmin("waiting_queue", 1);

        if (!next || next.length === 0) return;

        const [userId, score] = next;

        console.log(`Processing user ${userId} from waiting queue... `);
        const acquired = await acquire(clientRedis, userId);

        if (!acquired) {
            await clientRedis.zadd("waiting_queue", score, userId);
            console.log(`User ${userId} re-added to waiting queue. Queue length: ${await clientRedis.zcard("waiting_queue")}`);
            return;
        }

        await eventQueue.add("release", { userId }, { delay: SESSION_TTL });
    }

}


async function acquire(client, userId) {
    console.log(`Attempting to acquire slot for user ${userId}...`);
    const now = Date.now();

    await client.zremrangebyscore("active_sessions", "-inf", now);

    const count = await client.zcard("active_sessions");

    if (count >= CAPACITY) {
        return false;
    }

    await client.zadd("active_sessions", now + SESSION_TTL, userId);

    console.log(`User ${userId} acquired a slot. Active sessions: ${count + 1}`);
    return true;
}