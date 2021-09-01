import { Module } from '@nestjs/common';
import { SkipTimesService } from './skip-times.service';
import { SkipTimesControllerV1 } from './skip-times.controller';
import { RepositoriesModule } from '../repositories/repositories.module';
import { VoteModule } from '../vote/vote.module';

@Module({
  imports: [RepositoriesModule, VoteModule],
  providers: [SkipTimesService],
  controllers: [SkipTimesControllerV1],
})
export class SkipTimesModule {}
