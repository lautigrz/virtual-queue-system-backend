import { eventQueue } from "../worker/event-queue.js";

const CAPACITY = 5;

const SESSION_TTL = 10000;


export async function processQueue(clientRedis){

    const usuariosActivos = await clientRedis.zCard('active_sessions');

    if(usuariosActivos >= CAPACITY) return;

    const cupos = CAPACITY - usuariosActivos;

    const batchSize = Math.min(cupos, 5);

    const resultados = await clientRedis.zPopMinCount('waiting_queue', batchSize);
    

    if(resultados && resultados.length > 0){
        const idsAceptados = resultados.map(id => ({value: id.value, score: Date.now() + SESSION_TTL}));

        await clientRedis.zAdd('active_sessions', idsAceptados);
        
        await Promise.all(
            idsAceptados.map(user =>
            eventQueue.add(
                "release",
                { userId: user.value },
                { delay: SESSION_TTL }
            )
            )
  );

    }

}