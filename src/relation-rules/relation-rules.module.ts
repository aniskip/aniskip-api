import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { RelationRulesService } from "./relation-rules.service";

/** Relation rules shared by every API version. */
@Module({
  imports: [ConfigModule],
  providers: [RelationRulesService],
  exports: [RelationRulesService],
})
export class RelationRulesModule {}
