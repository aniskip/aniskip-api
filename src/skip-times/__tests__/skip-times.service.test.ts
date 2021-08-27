import { Test, TestingModule } from '@nestjs/testing';
import { Pool } from 'pg';
import { PostgresService } from '../../postgres';
import { SkipTimesRepository } from '../../repositories';
import { VoteService } from '../../vote';
import { SkipTimesService } from '../skip-times.service';

describe('SkipTimesService', () => {
  let skipTimesService: SkipTimesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Pool,
        PostgresService,
        SkipTimesRepository,
        VoteService,
        SkipTimesService,
      ],
    }).compile();

    skipTimesService = module.get<SkipTimesService>(SkipTimesService);
  });

  it('should be defined', () => {
    expect(skipTimesService).toBeDefined();
  });
});
