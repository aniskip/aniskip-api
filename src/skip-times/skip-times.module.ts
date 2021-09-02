import { Module } from '@nestjs/common';
import { SkipTimesService } from './skip-times.service';
import { SkipTimesControllerV2 } from './skip-times.controller.v2';
import { RepositoriesModule } from '../repositories/repositories.module';
import { VoteModule } from '../vote/vote.module';

@Module({
  imports: [RepositoriesModule, VoteModule],
  providers: [SkipTimesService],
  controllers: [SkipTimesControllerV2],
})
export class SkipTimesModule {}
