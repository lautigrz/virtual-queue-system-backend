
export async function clearUsuersExpired(clientRedis, userId) {

  const removed = await clientRedis.zrem("active_sessions", userId);

  if (removed > 0) {
    console.log(`User ${userId} session expired. Active sessions: ${await clientRedis.zcard("active_sessions")}`);

  }
}