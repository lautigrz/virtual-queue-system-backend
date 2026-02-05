export async function clearUsuersExpired(clientRedis){

    const now = Date.now();

    const eliminados = await clientRedis.zRemRangeByScore('active_sessions', '-inf', now);

    if (eliminados > 0) {
        console.log(`🧹 Se eliminaron ${eliminados} usuarios zombis por inactividad.`);
    }
}