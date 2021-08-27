import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Pool } from 'pg';
import { PostgresService } from '../postgres.service';

describe('PostgresService', () => {
  let postgresService: PostgresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigService, Pool, PostgresService],
    }).compile();

    postgresService = module.get<PostgresService>(PostgresService);
  });

  it('should be defined', () => {
    expect(postgresService).toBeDefined();
  });
});
