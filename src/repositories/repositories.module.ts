import { Module } from '@nestjs/common';
import { SkipTimesRepository } from './skip-times.repository';

@Module({
  providers: [SkipTimesRepository],
  exports: [SkipTimesRepository],
})
export class RepositoriesModule {}
