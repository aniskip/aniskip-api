import { DynamicModule, Global, Module } from '@nestjs/common';
import { PoolConfig } from 'pg';
import { POOL_CONFIG } from './postgres.constants';
import { PostgresService } from './postgres.service';

@Global()
@Module({})
export class PostgresModule {
  /**
   * Root Postgres Module.
   *
   * @param poolConfig PG pool configuration
   */
  static forRoot(poolConfig: PoolConfig): DynamicModule {
    return {
      module: PostgresModule,
      providers: [
        {
          provide: POOL_CONFIG,
          useValue: poolConfig,
        },
        PostgresService,
      ],
      exports: [PostgresService],
    };
  }
}
