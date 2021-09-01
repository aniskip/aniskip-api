import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { PostSkipTimesThrottlerGuardTestController } from './post-skip-times-throttler-guard-test.controller';

@Module({
  imports: [ThrottlerModule.forRoot()],
  controllers: [PostSkipTimesThrottlerGuardTestController],
})
export class PostSkipTimesThrottlerGuardTestModule {}
