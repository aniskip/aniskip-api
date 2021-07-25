import { Pool, QueryArrayResult } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: process.env.POSTGRES_HOST,
  database: 'db',
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const query = <T>(
  queryString: string,
  params: (string | number)[]
): Promise<QueryArrayResult<any>> => pool.query<T>(queryString, params);

const close = (): Promise<void> => pool.end();

export default { query, close };
