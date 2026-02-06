import IOredis from 'ioredis';

export const bullConnection = new IOredis({
    host: '127.0.0.1',
    port: 6379,
    maxRetriesPerRequest: null
})