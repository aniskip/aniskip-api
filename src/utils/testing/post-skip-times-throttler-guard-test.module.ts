import { Module } from '@nestjs/common';
import { minutes, ThrottlerModule } from '@nestjs/throttler';
import { PostSkipTimesThrottlerGuardTestController } from './post-skip-times-throttler-guard-test.controller';

@Module({
  imports: [ThrottlerModule.forRoot([{ ttl: minutes(1), limit: 120 }])],
  controllers: [PostSkipTimesThrottlerGuardTestController],
})
export class PostSkipTimesThrottlerGuardTestModule {}
