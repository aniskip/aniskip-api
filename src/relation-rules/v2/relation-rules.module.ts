import { Module } from '@nestjs/common';
import { RelationRulesModule } from '../relation-rules.module';
import { RelationRulesControllerV2 } from './relation-rules.controller';

@Module({
  imports: [RelationRulesModule],
  controllers: [RelationRulesControllerV2],
})
export class RelationRulesModuleV2 {}
