import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Pool } from "pg";

/** The Postgres connection pool, for features that store data. */
@Module({
  imports: [ConfigModule],
  providers: [
    {
      inject: [ConfigService],
      provide: Pool,
      useFactory: (configService: ConfigService): Pool => new Pool(configService.get("postgres")),
    },
  ],
  exports: [Pool],
})
export class DatabaseModule {}
