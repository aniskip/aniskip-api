import { Module } from '@nestjs/common';
import { poolConfig, PostgresModule } from './postgres';
import { SkipTimesModule } from './skip-times';

@Module({
  imports: [PostgresModule.forRoot(poolConfig), SkipTimesModule],
})
export class AppModule {}
