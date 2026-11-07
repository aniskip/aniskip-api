import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { SkipTimesRepository } from "./skip-times.repository";
import { SkipTimesService } from "./skip-times.service";
import { VoteService } from "./voting/vote.service";

/** Skip times logic shared by every API version. */
@Module({
  imports: [DatabaseModule],
  providers: [SkipTimesRepository, SkipTimesService, VoteService],
  exports: [SkipTimesService],
})
export class SkipTimesModule {}
