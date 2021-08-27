import { Module } from '@nestjs/common';
import { PostgresModule } from '../postgres';
import { SkipTimesRepository } from './skip-times.repository';

@Module({
  imports: [PostgresModule],
  providers: [SkipTimesRepository],
  exports: [SkipTimesRepository],
})
export class RepositoriesModule {}
