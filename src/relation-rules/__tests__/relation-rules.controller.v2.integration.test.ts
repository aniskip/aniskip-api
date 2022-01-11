import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { ThrottlerModule } from '@nestjs/throttler';
import request from 'supertest';
import { Config, config } from '../../config';
import { RelationRulesControllerV2 } from '../relation-rules.controller.v2';
import { RelationRulesService } from '../relation-rules.service';

describe('RelationRulesControllerV2', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const partialConfig = (): Partial<Config> => ({
      relations: config().relations,
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
        .get('/relation-rules/40028')
        .expect({
          statusCode: HttpStatus.OK,
          message: "Successfully found rules for animeId '40028'",
          found: true,
          rules: [
            {
              from: { start: 60, end: 75 },
              to: { malId: 40028, start: 1, end: 16 },
            },
            {
              from: { start: 17, end: 75 },
              to: { malId: 48583, start: 1, end: 59 },
            },
            { from: { start: 76 }, to: { malId: 48583, start: 1 } },
          ],
        })
        .expect(HttpStatus.OK, done);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
