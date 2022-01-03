import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { PostSkipTimesThrottlerGuardTestModule } from '../../testing/post-skip-times-throttler-guard-test.module';

describe('PostSkipTimesV1ThrottlerGuard', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [PostSkipTimesThrottlerGuardTestModule],
    }).compile();

    app = module.createNestApplication();
    app.enableVersioning();
    await app.init();
  });

  describe('GET /v1/test/{anime_id}/{episode_number}', () => {
    it('should respond with hello world', (done) => {
      request(app.getHttpServer())
        .post('/v1/test/1/1')
        .expect('hello world')
        .expect(201, done);
    });

    it('should respond with rate limited', (done) => {
      request(app.getHttpServer()).post('/v1/test/1/1').expect(429, done);
    });

    it('should respond with hello world', (done) => {
      request(app.getHttpServer())
        .post('/v1/test/2/1')
        .expect('hello world')
        .expect(201, done);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
