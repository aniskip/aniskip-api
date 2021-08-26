import { Module } from '@nestjs/common';
import { poolConfig, PostgresModule } from './postgres';
import { RelationRulesModule } from './relation-rules';
import { SkipTimesModule } from './skip-times';

@Module({
  imports: [
    PostgresModule.forRoot(poolConfig),
    SkipTimesModule,
    RelationRulesModule,
  ],
})
export class AppModule {}
