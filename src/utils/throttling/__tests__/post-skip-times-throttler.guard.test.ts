import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { PostSkipTimesThrottlerGuardTestModule } from '../../testing/post-skip-times-throttler-guard-test.module';

describe('MorganMiddleware', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [PostSkipTimesThrottlerGuardTestModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  describe('GET /test/{animeId}/{episodeNumber}', () => {
    it('responds with hello world', (done) => {
      request(app.getHttpServer())
        .post('/test/1/1')
        .expect('hello world')
        .expect(201, done);
    });

    it('responds with rate limited', (done) => {
      request(app.getHttpServer()).post('/test/1/1').expect(429, done);
    });

    it('responds with hello world', (done) => {
      request(app.getHttpServer())
        .post('/test/2/1')
        .expect('hello world')
        .expect(201, done);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
