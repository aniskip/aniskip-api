import { RedisOptions } from 'ioredis';
import { PoolConfig } from 'pg';

export type Config = {
  postgres: PoolConfig;
  redis: RedisOptions;
};
