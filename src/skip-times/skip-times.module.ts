import { Module } from '@nestjs/common';
import { SkipTimesServiceV1 } from './skip-times.service.v1';
import { SkipTimesServiceV2 } from './skip-times.service.v2';
import { SkipTimesControllerV1 } from './skip-times.controller.v1';
import { SkipTimesControllerV2 } from './skip-times.controller.v2';
import { RepositoriesModule } from '../repositories/repositories.module';
import { VoteModule } from '../vote/vote.module';

@Module({
  imports: [RepositoriesModule, VoteModule],
  providers: [SkipTimesServiceV1, SkipTimesServiceV2],
  controllers: [SkipTimesControllerV1, SkipTimesControllerV2],
})
export class SkipTimesModule {}
