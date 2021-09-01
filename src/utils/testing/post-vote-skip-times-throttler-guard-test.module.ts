import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { PostVoteSkipTimesThrottlerGuardTestController } from './post-vote-skip-times-throttler-guard-test.controller';

@Module({
  imports: [ThrottlerModule.forRoot()],
  controllers: [PostVoteSkipTimesThrottlerGuardTestController],
})
export class PostVoteSkipTimesThrottlerGuardTestModule {}
