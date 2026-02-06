import { Queue } from "bullmq";
import { bullConnection } from "../config/bull-connection.js";

export const eventQueue = new Queue("event-queue", {
    connection: bullConnection
})