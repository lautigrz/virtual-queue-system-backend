import { eventQueue } from "../worker/event-queue.js";
export async function clearUsuersExpired(clientRedis){

    const now = Date.now();

    const eliminados = await clientRedis.zRemRangeByScore('active_sessions', '-inf', now);

      if (eliminados === 0) return;

      const waiting = await clientRedis.zCard("waiting_queue");

      if (waiting === 0) return;

        await eventQueue.add( "process-user", {},
        {
            jobId: "process-queue",
            removeOnComplete: true,
            removeOnFail: true
        }
);

}