import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { PostgresService } from './postgres.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      inject: [ConfigService],
      provide: Pool,
      useFactory: (configService: ConfigService): Pool =>
        new Pool(configService.get('postgres')),
    },
    PostgresService,
  ],
  exports: [PostgresService],
})
export class PostgresModule {}
