import { Module } from '@nestjs/common';
import { RelationRulesModule } from '../relation-rules.module';
import { RelationRulesControllerV1 } from './relation-rules.controller';

@Module({
  imports: [RelationRulesModule],
  controllers: [RelationRulesControllerV1],
})
export class RelationRulesModuleV1 {}
