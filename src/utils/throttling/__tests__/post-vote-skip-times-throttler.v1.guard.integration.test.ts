import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { PostVoteSkipTimesThrottlerGuardTestModule } from '../../testing/post-vote-skip-times-throttler-guard-test.module';

describe('PostVoteSkipTimesV1ThrottlerGuard', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [PostVoteSkipTimesThrottlerGuardTestModule],
    }).compile();

    app = module.createNestApplication();
    app.enableVersioning();
    await app.init();
  });

  describe('GET /v1/test/{skip_id}', () => {
    it('should respond with hello world', (done) => {
      request(app.getHttpServer())
        .post('/v1/test/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee')
        .expect('hello world')
        .expect(201, done);
    });

    it('should respond with rate limited', (done) => {
      request(app.getHttpServer())
        .post('/v1/test/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee')
        .expect(429, done);
    });

    it('should respond with hello world', (done) => {
      request(app.getHttpServer())
        .post('/v1/test/aaaaaaaa-bbbb-cccc-dddd-ffffffffffff')
        .expect('hello world')
        .expect(201, done);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
