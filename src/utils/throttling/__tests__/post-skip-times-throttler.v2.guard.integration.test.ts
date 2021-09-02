import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { PostSkipTimesThrottlerGuardTestModule } from '../../testing/post-skip-times-throttler-guard-test.module';

describe('PostSkipTimesV2ThrottlerGuard', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [PostSkipTimesThrottlerGuardTestModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  describe('GET /test/{animeId}/{episodeNumber}', () => {
    it('should respond with hello world', (done) => {
      request(app.getHttpServer())
        .post('/test/1/1')
        .expect('hello world')
        .expect(201, done);
    });

    it('should respond with rate limited', (done) => {
      request(app.getHttpServer()).post('/test/1/1').expect(429, done);
    });

    it('should respond with hello world', (done) => {
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
