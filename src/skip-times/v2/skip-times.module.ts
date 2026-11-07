import { Module } from "@nestjs/common";
import { SkipTimesModule } from "../skip-times.module";
import { SkipTimesControllerV2 } from "./skip-times.controller";

@Module({
  imports: [SkipTimesModule],
  controllers: [SkipTimesControllerV2],
})
export class SkipTimesModuleV2 {}
