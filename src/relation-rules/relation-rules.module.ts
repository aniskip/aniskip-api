import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RelationRulesService } from './relation-rules.service';
import { RelationRulesControllerV1 } from './v1/relation-rules.controller';
import { RelationRulesControllerV2 } from './v2/relation-rules.controller';

@Module({
  imports: [ConfigModule],
  controllers: [RelationRulesControllerV1, RelationRulesControllerV2],
  providers: [RelationRulesService],
})
export class RelationRulesModule {}
