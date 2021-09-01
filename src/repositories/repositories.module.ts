import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { SkipTimesRepository } from './skip-times.repository';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      inject: [ConfigService],
      provide: Pool,
      useFactory: (configService: ConfigService): Pool =>
        new Pool(configService.get('postgres')),
    },
    SkipTimesRepository,
  ],
  exports: [SkipTimesRepository],
})
export class RepositoriesModule {}
