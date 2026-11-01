import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { SkipTimesRepository } from './skip-times.repository';
import { SkipTimesService } from './skip-times.service';
import { SkipTimesControllerV1 } from './v1/skip-times.controller';
import { SkipTimesControllerV2 } from './v2/skip-times.controller';
import { VoteService } from './voting/vote.service';

@Module({
  imports: [DatabaseModule],
  providers: [SkipTimesRepository, SkipTimesService, VoteService],
  controllers: [SkipTimesControllerV1, SkipTimesControllerV2],
})
export class SkipTimesModule {}
