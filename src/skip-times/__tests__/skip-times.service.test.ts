import { Test, TestingModule } from '@nestjs/testing';
import { Pool } from 'pg';
import { PostgresService } from '../../postgres';
import { SkipTimesRepository } from '../../repositories';
import { VoteService } from '../../vote';
import { SkipTimesService } from '../skip-times.service';

describe('SkipTimesService', () => {
  let service: SkipTimesService;

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

    service = module.get<SkipTimesService>(SkipTimesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
