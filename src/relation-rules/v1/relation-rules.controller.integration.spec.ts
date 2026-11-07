import { afterAll, beforeAll, describe, it } from "bun:test";
import path from "node:path";
import { HttpStatus, type INestApplication } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import { minutes, ThrottlerModule } from "@nestjs/throttler";
import { ZodValidationPipe } from "nestjs-zod";
import request from "supertest";
import type { Config } from "../../config/configuration.types";
import { RelationRulesService } from "../relation-rules.service";
import { RelationRulesControllerV1 } from "./relation-rules.controller";

describe("RelationRulesControllerV1", () => {
  let app: INestApplication;

  beforeAll(async () => {
    // A fixed fixture, so upstream anime-relations updates don't break it.
    const partialConfig = (): Partial<Config> => ({
      relations: {
        filePath: path.join(__dirname, "..", "anime-relations.fixture.txt"),
      },
    });

    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ load: [partialConfig] }),
        ThrottlerModule.forRoot([{ ttl: minutes(1), limit: 120 }]),
      ],
      controllers: [RelationRulesControllerV1],
      providers: [RelationRulesService],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ZodValidationPipe());
    await app.init();
  });

  describe("GET /rules/{anime_id}", () => {
    it("should respond with a rule", (done) => {
      request(app.getHttpServer())
        .get("/rules/37178")
        .expect({
          found: true,
          rules: [
            {
              from: { start: 52, end: 102 },
              to: { malId: 38804, start: 1, end: 51 },
            },
            { from: { start: 103 }, to: { malId: 40880, start: 1 } },
          ],
        })
        .expect(HttpStatus.OK, done);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
