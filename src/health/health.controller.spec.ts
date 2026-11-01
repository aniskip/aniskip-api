import { afterEach, beforeEach, describe, expect, it, jest } from 'bun:test';
import { HttpStatus, type INestApplication } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { Test } from '@nestjs/testing';
import { Pool } from 'pg';
import request from 'supertest';
import { REDIS } from './health.constants';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let app: INestApplication;
  const pool = { query: jest.fn() };
  const redis = { ping: jest.fn() };

  beforeEach(async () => {
    pool.query.mockReset().mockResolvedValue({ rows: [] });
    redis.ping.mockReset().mockResolvedValue('PONG');

    const module = await Test.createTestingModule({
      imports: [TerminusModule.forRoot({ logger: false })],
      controllers: [HealthController],
      providers: [
        { provide: Pool, useValue: pool },
        { provide: REDIS, useValue: redis },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should be ok when Postgres and Redis are up', async () => {
    const res = await request(app.getHttpServer()).get('/health');
    expect(res.status).toBe(HttpStatus.OK);
    expect(res.body.status).toBe('ok');
    expect(res.body.info.database.status).toBe('up');
    expect(res.body.info.redis.status).toBe('up');
  });

  it('should be unavailable when Postgres is down', async () => {
    pool.query.mockRejectedValue(new Error('connection refused'));

    const res = await request(app.getHttpServer()).get('/health');
    expect(res.status).toBe(HttpStatus.SERVICE_UNAVAILABLE);
    expect(res.body.error.database.status).toBe('down');
    expect(res.body.info.redis.status).toBe('up');
  });

  it('should not reveal the underlying error', async () => {
    pool.query.mockRejectedValue(
      new Error('connect ECONNREFUSED 172.18.0.3:5432'),
    );

    const res = await request(app.getHttpServer()).get('/health');
    expect(res.text).not.toContain('ECONNREFUSED');
    expect(res.body.error.database.message).toBe('unreachable');
  });

  it('should be unavailable when Redis is down', async () => {
    redis.ping.mockRejectedValue(new Error('connection refused'));

    const res = await request(app.getHttpServer()).get('/health');
    expect(res.status).toBe(HttpStatus.SERVICE_UNAVAILABLE);
    expect(res.body.error.redis.status).toBe('down');
  });

  it('should be unavailable when a check hangs', async () => {
    pool.query.mockReturnValue(new Promise(() => {}));

    const res = await request(app.getHttpServer()).get('/health');
    expect(res.status).toBe(HttpStatus.SERVICE_UNAVAILABLE);
    expect(res.body.error.database.status).toBe('down');
  }, 10_000);
});
