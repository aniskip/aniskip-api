import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { ThrottlerModule } from '@nestjs/throttler';
import request from 'supertest';
import { Config, config } from '../../config';
import { RelationRulesControllerV1 } from '../relation-rules.controller.v1';
import { RelationRulesService } from '../relation-rules.service';

describe('RelationRulesControllerV1', () => {
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

  describe('GET /rules/{anime_id}', () => {
    it('should respond with a rule', (done) => {
      request(app.getHttpServer())
        .get('/rules/40028')
        .expect({
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
