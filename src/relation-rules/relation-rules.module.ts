import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RelationRulesControllerV1 } from './relation-rules.controller.v1';
import { RelationRulesControllerV2 } from './relation-rules.controller.v2';
import { RelationRulesService } from './relation-rules.service';

@Module({
  imports: [ConfigModule],
  controllers: [RelationRulesControllerV1, RelationRulesControllerV2],
  providers: [RelationRulesService],
})
export class RelationRulesModule {}
