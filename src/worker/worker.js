import { Worker } from "bullmq";
import { bullConnection } from "../config/bull-connection.js";
import {redis} from "../config/redis-client.js";
import {processQueue} from "../utils/process-queue.js";
import { clearUsuersExpired } from "../utils/delete-queue.js";

await redis.connect();

const worker = new Worker("event-queue", async job => {
    
  try {

      if(job.name === "process-user"){
        console.log("Processing queue...");
        await processQueue(redis.getClient());

      }else if(job.name === "release"){
        console.log("Processing realse...");
        await clearUsuersExpired(redis.getClient());
      }

      console.log("processQueue terminó");
    } catch (err) {
      console.error("Error en worker:", err);
      throw err; 
    }


},{
    connection: bullConnection,
    concurrency: 1
})
