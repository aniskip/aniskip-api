import { afterAll, beforeAll, describe, it } from 'bun:test';
import path from 'node:path';
import {
  HttpStatus,
  type INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { ThrottlerModule } from '@nestjs/throttler';
import request from 'supertest';
import type { Config } from '../../config';
import { RelationRulesControllerV2 } from '../relation-rules.controller.v2';
import { RelationRulesService } from '../relation-rules.service';

describe('RelationRulesControllerV2', () => {
  let app: INestApplication;

  beforeAll(async () => {
    // A fixed fixture, so upstream anime-relations updates don't break it.
    const partialConfig = (): Partial<Config> => ({
      relations: { filePath: path.join(__dirname, 'anime-relations.test.txt') },
    });

    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ load: [partialConfig] }),
        ThrottlerModule.forRoot(),
      ],
      controllers: [RelationRulesControllerV2],
      providers: [RelationRulesService],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  });

  describe('GET /relation-rules/{animeId}', () => {
    it('should respond with a rule', (done) => {
      request(app.getHttpServer())
        .get('/relation-rules/37178')
        .expect({
          statusCode: HttpStatus.OK,
          message: "Successfully found rules for animeId '37178'",
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
