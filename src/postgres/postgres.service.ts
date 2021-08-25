import { Inject, Injectable } from '@nestjs/common';
import { Pool, PoolConfig, QueryResult } from 'pg';
import { POOL_CONFIG } from './postgres.constants';

@Injectable()
export class PostgresService {
  /**
   * Pool instance.
   */
  pool: Pool;

  /**
   * Constructor.
   */
  constructor(@Inject(POOL_CONFIG) private poolConfig: PoolConfig) {
    this.pool = new Pool(this.poolConfig);
  }

  /**
   * Queries the database.
   *
   * @param queryString String to query the database.
   * @param params Parameters used in the query string.
   */
  query<T>(
    queryString: string,
    params: (string | number)[]
  ): Promise<QueryResult<T>> {
    return this.pool.query<T>(queryString, params);
  }
}
