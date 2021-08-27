import { Test, TestingModule } from '@nestjs/testing';
import { getOptionsToken } from '@nestjs/throttler';
import { ThrottlerStorageProvider } from '@nestjs/throttler/dist/throttler.providers';
import { Pool } from 'pg';
import { PostgresService } from '../../postgres';
import { SkipTimesRepository } from '../../repositories';
import { VoteService } from '../../vote';
import { SkipTimesControllerV1 } from '../skip-times.controller';
import { SkipTimesService } from '../skip-times.service';

describe('SkipTimesController', () => {
  let skipTimesController: SkipTimesControllerV1;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SkipTimesControllerV1],
      providers: [
        {
          provide: getOptionsToken(),
          useValue: {},
        },
        ThrottlerStorageProvider,
        Pool,
        PostgresService,
        SkipTimesRepository,
        VoteService,
        SkipTimesService,
      ],
    }).compile();

    skipTimesController = module.get<SkipTimesControllerV1>(
      SkipTimesControllerV1
    );
  });

  it('should be defined', () => {
    expect(skipTimesController).toBeDefined();
  });
});
