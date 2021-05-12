import Redis from 'ioredis';

const redisClient = new Redis({
  host: 'redis',
  port: 6379,
});

export default redisClient;
