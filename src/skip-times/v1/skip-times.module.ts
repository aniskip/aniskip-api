import { Module } from "@nestjs/common";
import { SkipTimesModule } from "../skip-times.module";
import { SkipTimesControllerV1 } from "./skip-times.controller";

@Module({
  imports: [SkipTimesModule],
  controllers: [SkipTimesControllerV1],
})
export class SkipTimesModuleV1 {}
