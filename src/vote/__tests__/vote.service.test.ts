import { Test, TestingModule } from '@nestjs/testing';
import { resolve } from 'path/posix';
import { Pool } from 'pg';
import { PostgresService } from '../../postgres';
import { SkipTimesRepository } from '../../repositories';
import { VoteService } from '../vote.service';

describe('VoteService', () => {
  let votingService: VoteService;
  let skipTimesRepository: SkipTimesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Pool, PostgresService, SkipTimesRepository, VoteService],
    }).compile();

    votingService = module.get<VoteService>(VoteService);
    skipTimesRepository = module.get<SkipTimesRepository>(SkipTimesRepository);

    jest
      .spyOn(skipTimesRepository, 'getAverageOfLastTenSkipTimesVotes')
      .mockImplementation((submitterId) => {
        switch (submitterId) {
          case 'e93e3787-3071-4d1f-833f-a78755702f6b':
            return Promise.resolve(3.5);
          default:
            return Promise.resolve(0);
        }
      });
  });

  it('should be defined', () => {
    expect(votingService).toBeDefined();
  });

  it("detects a bad skip time in a 'full' episode", async () => {
    const votes = await votingService.autoVote(
      0,
      0,
      1440,
      '17ca2744-c222-4856-bc75-450498b1699e'
    );
    expect(votes).toBe(-10);
  });

  it("detects a bad skip time in a 'full' episode", async () => {
    const votes = await votingService.autoVote(
      1,
      1.5,
      1440,
      '17ca2744-c222-4856-bc75-450498b1699e'
    );
    expect(votes).toBe(-10);
  });

  it("detects a bad skip time in a 'full' episode", async () => {
    const votes = await votingService.autoVote(
      0,
      1000,
      1440,
      '17ca2744-c222-4856-bc75-450498b1699e'
    );
    expect(votes).toBe(-10);
  });

  it("detects a bad skip time in a 'full' episode", async () => {
    const votes = await votingService.autoVote(
      0,
      1440,
      1440,
      '17ca2744-c222-4856-bc75-450498b1699e'
    );
    expect(votes).toBe(-10);
  });

  it('detects a user with good reputation', async () => {
    const votes = await votingService.autoVote(
      130,
      210,
      1440,
      'e93e3787-3071-4d1f-833f-a78755702f6b'
    );
    expect(votes).toBe(1);
  });

  it("detects a normal skip time in a 'full' episode", async () => {
    const votes = await votingService.autoVote(
      130,
      210,
      1440,
      '17ca2744-c222-4856-bc75-450498b1699e'
    );
    expect(votes).toBe(0);
  });

  it("detects a bad skip time in a 'short' episode", async () => {
    const votes = await votingService.autoVote(
      0,
      55,
      118,
      '17ca2744-c222-4856-bc75-450498b1699e'
    );
    expect(votes).toBe(-10);
  });

  it("detects a normal skip time in a 'short' episode", async () => {
    const votes = await votingService.autoVote(
      30,
      55,
      119,
      '17ca2744-c222-4856-bc75-450498b1699e'
    );
    expect(votes).toBe(0);
  });

  it("detects a bad skip time in a 'half' episode", async () => {
    const votes = await votingService.autoVote(
      0,
      240,
      719,
      '17ca2744-c222-4856-bc75-450498b1699e'
    );
    expect(votes).toBe(-10);
  });

  it("detects a normal skip time in a 'half' episode", async () => {
    const votes = await votingService.autoVote(
      100,
      160,
      719,
      '17ca2744-c222-4856-bc75-450498b1699e'
    );
    expect(votes).toBe(0);
  });

  it("detects a bad skip time in a 'movie' episode", async () => {
    const votes = await votingService.autoVote(
      0,
      960,
      5400,
      '17ca2744-c222-4856-bc75-450498b1699e'
    );
    expect(votes).toBe(-10);
  });

  it("detects a normal skip time in a 'movie' episode", async () => {
    const votes = await votingService.autoVote(
      0,
      420,
      5400,
      '17ca2744-c222-4856-bc75-450498b1699e'
    );
    expect(votes).toBe(0);
  });
});
