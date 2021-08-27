import { Injectable } from '@nestjs/common';
import { Pool, QueryResult } from 'pg';

@Injectable()
export class PostgresService {
  /**
   * Constructor.
   */
  constructor(private pool: Pool) {}

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
