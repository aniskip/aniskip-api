import { Module } from '@nestjs/common';
import { SkipTimesService } from './skip-times.service';
import { SkipTimesControllerV1 } from './skip-times.controller';
import { SkipTimesRepository } from './skip-times.repository';

@Module({
  providers: [SkipTimesRepository, SkipTimesService],
  controllers: [SkipTimesControllerV1],
})
export class SkipTimesModule {}
