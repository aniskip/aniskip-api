import Redis from 'ioredis';

const redisClient = new Redis({
  host: 'redis',
  port: 6379,
});

if (process.env.NODE_ENV === 'test') {
  redisClient.quit();
}

export default redisClient;
