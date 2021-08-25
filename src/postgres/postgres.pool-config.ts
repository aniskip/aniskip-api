import { PoolConfig } from 'pg';

export const poolConfig: PoolConfig = {
  user: 'postgres',
  host: process.env.POSTGRES_HOST,
  database: 'db',
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};
