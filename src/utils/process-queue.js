
const CAPACITY = 5;

const SESSION_TTL = 40000;
const OPEN_TIME = new Date('2026-02-05T20:07:00').getTime();

export async function processQueue(clientRedis){

   if(Date.now() < OPEN_TIME){
        console.log("La tienda aún no está abierta. Hora de apertura:", new Date(OPEN_TIME).toLocaleString());
        return;
    }
    const usuariosActivos = await clientRedis.zCard('active_sessions');

    console.log("Usuarios activos en la tienda:", usuariosActivos);

    if(usuariosActivos >= CAPACITY){
        console.log("Tienda llena. Esperando a que alguien salga...");
        return;
    }

    const cupos = CAPACITY - usuariosActivos;

    const batchSize = Math.min(cupos, 5);


    const usuariosEnEspera = await clientRedis.zCard('waiting_queue');

    console.log("Usuarios en espera:", usuariosEnEspera);


    const resultados = await clientRedis.zPopMinCount('waiting_queue', batchSize);
    

    if(resultados && resultados.length > 0){
        const idsAceptados = resultados.map(id => ({value: id.value, score: Date.now() + SESSION_TTL}));

        await clientRedis.zAdd('active_sessions', idsAceptados);

        console.log(`Usuarios admitidos a la tienda: ${idsAceptados.join(', ')}`);
    }

}