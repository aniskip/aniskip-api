import { Module } from '@nestjs/common';
import { SkipTimesModule } from './skip-times/skip-times.module';

@Module({
  imports: [SkipTimesModule],
})
export class AppModule {}
