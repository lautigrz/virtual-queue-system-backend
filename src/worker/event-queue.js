import { Queue } from "bullmq";
import { redis } from "../config/redis-client.js";

const client = redis.connect();

export const eventQueue = new Queue("event-queue", {
    connection: client
})

export const addProcessJob = async () => {
    await eventQueue.add(
        "process-user",
        {},
        {
            repeat: { every: 1000 },
            jobId: "process-user-job"
        }
    );

    console.log("Scheduler process-user registrado");
}