import { Module } from '@nestjs/common';
import { SkipTimesService } from './skip-times.service';
import { SkipTimesControllerV1 } from './skip-times.controller';
import { RepositoriesModule } from '../repositories';
import { VoteModule } from '../vote';

@Module({
  imports: [RepositoriesModule, VoteModule],
  providers: [SkipTimesService],
  controllers: [SkipTimesControllerV1],
})
export class SkipTimesModule {}
