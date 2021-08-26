import { Module } from '@nestjs/common';
import { RelationRulesControllerV1 } from './relation-rules.controller';
import { RelationRulesService } from './relation-rules.service';

@Module({
  controllers: [RelationRulesControllerV1],
  providers: [RelationRulesService],
})
export class RelationRulesModule {}
