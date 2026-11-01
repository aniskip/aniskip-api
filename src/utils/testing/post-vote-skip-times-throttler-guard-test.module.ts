import { Module } from '@nestjs/common';
import { minutes, ThrottlerModule } from '@nestjs/throttler';
import { PostVoteSkipTimesThrottlerGuardTestController } from './post-vote-skip-times-throttler-guard-test.controller';

@Module({
  imports: [ThrottlerModule.forRoot([{ ttl: minutes(1), limit: 120 }])],
  controllers: [PostVoteSkipTimesThrottlerGuardTestController],
})
export class PostVoteSkipTimesThrottlerGuardTestModule {}
