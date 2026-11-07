import type { RedisOptions } from "ioredis";
import type { PoolConfig } from "pg";

export type RelationsConfig = {
  filePath: string;
};

export type Config = {
  postgres: PoolConfig;
  redis: RedisOptions;
  relations: RelationsConfig;
};
