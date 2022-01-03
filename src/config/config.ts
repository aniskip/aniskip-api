import path from 'path';
import { Config } from './config.types';

export const config = (): Config => ({
  postgres: {
    user: 'postgres',
    host: process.env.POSTGRES_HOST,
    database: 'db',
    password: process.env.POSTGRES_PASSWORD,
    port: 5432,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  },
  redis: {
    host: 'redis',
    port: 6379,
  },
  relations: {
    filePath: path.join(
      __dirname,
      '..',
      '..',
      'deps',
      'anime-relations',
      'anime-relations.txt'
    ),
  },
});
