import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { ThrottlerModule } from '@nestjs/throttler';
import * as request from 'supertest';
import { Config, config } from '../../config';
import { RelationRulesControllerV1 } from '../relation-rules.controller';
import { RelationRulesService } from '../relation-rules.service';

describe('RelationRulesController', () => {
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
      controllers: [RelationRulesControllerV1],
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
              from: {
                start: 60,
                end: 75,
              },
              to: {
                malId: 40028,
                start: 1,
                end: 16,
              },
            },
          ],
        })
        .expect(HttpStatus.OK, done);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
