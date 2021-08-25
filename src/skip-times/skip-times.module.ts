import { Module } from '@nestjs/common';
import { SkipTimesService } from './skip-times.service';
import { SkipTimesControllerV1 } from './skip-times.controller';

@Module({
  providers: [SkipTimesService],
  controllers: [SkipTimesControllerV1],
})
export class SkipTimesModule {}
