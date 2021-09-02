import { RedisOptions } from 'ioredis';
import { PoolConfig } from 'pg';

export type RelationsConfig = {
  filePath: string;
};

export type Config = {
  postgres: PoolConfig;
  redis: RedisOptions;
  relations: RelationsConfig;
};
