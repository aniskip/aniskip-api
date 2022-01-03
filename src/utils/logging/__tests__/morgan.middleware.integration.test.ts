import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { MorganTestModule } from '../../testing/morgan-test.module';

describe('MorganMiddleware', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [MorganTestModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  describe('GET /test', () => {
    it('should respond with hello world', (done) => {
      request(app.getHttpServer())
        .get('/test')
        .expect('hello world')
        .expect(HttpStatus.OK, done);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
