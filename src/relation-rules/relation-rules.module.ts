import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RelationRulesControllerV2 } from './relation-rules.controller';
import { RelationRulesService } from './relation-rules.service';

@Module({
  imports: [ConfigModule],
  controllers: [RelationRulesControllerV2],
  providers: [RelationRulesService],
})
export class RelationRulesModule {}
