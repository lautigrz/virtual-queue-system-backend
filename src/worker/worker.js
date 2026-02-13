import { Worker } from "bullmq";
import { processQueue } from "../utils/process-queue.js";
import { clearUsuersExpired } from "../utils/delete-queue.js";

import { redis } from "../config/redis-client.js";

const client = redis.connect();

const worker = new Worker("event-queue", async job => {

  try {

    if (job.name === "process-user") {
      console.log("Processing queue...");
      await processQueue(client);

    } else if (job.name === "release") {
      console.log("Processing release...");
      await clearUsuersExpired(client, job.data.userId);
    }

    console.log("processQueue terminó");
  } catch (err) {
    console.error("Error en worker:", err);
    throw err;
  }

}, {
  connection: client,
  concurrency: 1
})
