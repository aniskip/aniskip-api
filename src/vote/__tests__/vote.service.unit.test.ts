import { beforeEach, describe, expect, it, jest } from 'bun:test';
import { Test, TestingModule } from '@nestjs/testing';
import { SkipTimesRepository } from '../../repositories';
import { VoteService } from '../vote.service';

describe('VoteService', () => {
  let votingService: VoteService;

  beforeEach(async () => {
    const mockSkipTimesRepositoryProvider = {
      provide: SkipTimesRepository,
      useValue: {
        getAverageOfLastTenSkipTimesVotes: jest.fn((submitterId) => {
          switch (submitterId) {
            case 'e93e3787-3071-4d1f-833f-a78755702f6b':
              return Promise.resolve(3.5);
            default:
              return Promise.resolve(0);
          }
        }),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [mockSkipTimesRepositoryProvider, VoteService],
    }).compile();

    votingService = module.get<VoteService>(VoteService);
  });

  it('should be defined', () => {
    expect(votingService).toBeDefined();
  });

  describe('autoVote', () => {
    it('should detect a user with good reputation', async () => {
      const votes = await votingService.autoVote(
        130,
        210,
        1440,
        'e93e3787-3071-4d1f-833f-a78755702f6b',
      );
      expect(votes).toBe(1);
    });

    it("should detect a bad skip time in a 'full' episode", async () => {
      const votes = await votingService.autoVote(
        0,
        0,
        1440,
        '17ca2744-c222-4856-bc75-450498b1699e',
      );
      expect(votes).toBe(-10);
    });

    it("should detect a bad skip time in a 'full' episode", async () => {
      const votes = await votingService.autoVote(
        1,
        1.5,
        1440,
        '17ca2744-c222-4856-bc75-450498b1699e',
      );
      expect(votes).toBe(-10);
    });

    it("should detect a bad skip time in a 'full' episode", async () => {
      const votes = await votingService.autoVote(
        0,
        1000,
        1440,
        '17ca2744-c222-4856-bc75-450498b1699e',
      );
      expect(votes).toBe(-10);
    });

    it("should detect a bad skip time in a 'full' episode", async () => {
      const votes = await votingService.autoVote(
        0,
        1440,
        1440,
        '17ca2744-c222-4856-bc75-450498b1699e',
      );
      expect(votes).toBe(-10);
    });

    it("should detect a normal skip time in a 'full' episode", async () => {
      const votes = await votingService.autoVote(
        130,
        210,
        1440,
        '17ca2744-c222-4856-bc75-450498b1699e',
      );
      expect(votes).toBe(0);
    });

    it("should detect a bad skip time in a 'short' episode", async () => {
      const votes = await votingService.autoVote(
        0,
        55,
        118,
        '17ca2744-c222-4856-bc75-450498b1699e',
      );
      expect(votes).toBe(-10);
    });

    it("should detect a normal skip time in a 'short' episode", async () => {
      const votes = await votingService.autoVote(
        30,
        55,
        119,
        '17ca2744-c222-4856-bc75-450498b1699e',
      );
      expect(votes).toBe(0);
    });

    it("should detect a bad skip time in a 'half' episode", async () => {
      const votes = await votingService.autoVote(
        0,
        240,
        719,
        '17ca2744-c222-4856-bc75-450498b1699e',
      );
      expect(votes).toBe(-10);
    });

    it("should detect a normal skip time in a 'half' episode", async () => {
      const votes = await votingService.autoVote(
        100,
        160,
        719,
        '17ca2744-c222-4856-bc75-450498b1699e',
      );
      expect(votes).toBe(0);
    });

    it("should detect a bad skip time in a 'movie' episode", async () => {
      const votes = await votingService.autoVote(
        0,
        960,
        5400,
        '17ca2744-c222-4856-bc75-450498b1699e',
      );
      expect(votes).toBe(-10);
    });

    it("should detect a normal skip time in a 'movie' episode", async () => {
      const votes = await votingService.autoVote(
        0,
        420,
        5400,
        '17ca2744-c222-4856-bc75-450498b1699e',
      );
      expect(votes).toBe(0);
    });

    it("should detect a bad 'recap' skip time in a 'full' episode", async () => {
      const votes = await votingService.autoVote(
        0,
        0,
        1440,
        '17ca2744-c222-4856-bc75-450498b1699e',
        'recap',
      );
      expect(votes).toBe(-10);
    });

    it("should detect a bad 'recap' skip time in a 'full' episode", async () => {
      const votes = await votingService.autoVote(
        1,
        1.5,
        1440,
        '17ca2744-c222-4856-bc75-450498b1699e',
        'recap',
      );
      expect(votes).toBe(-10);
    });

    it("should detect a bad 'recap' skip time in a 'full' episode", async () => {
      const votes = await votingService.autoVote(
        0,
        1000,
        1440,
        '17ca2744-c222-4856-bc75-450498b1699e',
        'recap',
      );
      expect(votes).toBe(-10);
    });

    it("should detect a bad 'recap' skip time in a 'full' episode", async () => {
      const votes = await votingService.autoVote(
        0,
        1440,
        1440,
        '17ca2744-c222-4856-bc75-450498b1699e',
        'recap',
      );
      expect(votes).toBe(-10);
    });

    it("should detect a normal 'recap' skip time in a 'full' episode", async () => {
      const votes = await votingService.autoVote(
        130,
        370,
        1440,
        '17ca2744-c222-4856-bc75-450498b1699e',
        'recap',
      );
      expect(votes).toBe(0);
    });

    it("should detect a bad 'recap' skip time in a 'short' episode", async () => {
      const votes = await votingService.autoVote(
        0,
        55,
        118,
        '17ca2744-c222-4856-bc75-450498b1699e',
        'recap',
      );
      expect(votes).toBe(-10);
    });

    it("should detect a normal 'recap' skip time in a 'short' episode", async () => {
      const votes = await votingService.autoVote(
        30,
        55,
        119,
        '17ca2744-c222-4856-bc75-450498b1699e',
        'recap',
      );
      expect(votes).toBe(0);
    });

    it("should detect a bad 'recap' skip time in a 'half' episode", async () => {
      const votes = await votingService.autoVote(
        0,
        240,
        719,
        '17ca2744-c222-4856-bc75-450498b1699e',
        'recap',
      );
      expect(votes).toBe(-10);
    });

    it("should detect a normal 'recap' skip time in a 'half' episode", async () => {
      const votes = await votingService.autoVote(
        100,
        220,
        719,
        '17ca2744-c222-4856-bc75-450498b1699e',
        'recap',
      );
      expect(votes).toBe(0);
    });

    it("should detect a bad 'recap' skip time in a 'movie' episode", async () => {
      const votes = await votingService.autoVote(
        0,
        960,
        5400,
        '17ca2744-c222-4856-bc75-450498b1699e',
        'recap',
      );
      expect(votes).toBe(-10);
    });

    it("should detect a normal 'recap' skip time in a 'movie' episode", async () => {
      const votes = await votingService.autoVote(
        0,
        720,
        5400,
        '17ca2744-c222-4856-bc75-450498b1699e',
        'recap',
      );
      expect(votes).toBe(0);
    });
  });

  describe('autoVote for endings', () => {
    const untrusted = '17ca2744-c222-4856-bc75-450498b1699e';

    it("should accept a 4 minute ending in a 'full' episode", async () => {
      // 187 s ending, as in issue #687.
      expect(
        await votingService.autoVote(1253, 1440, 1440, untrusted, 'ed'),
      ).toBe(0);
      expect(await votingService.autoVote(0, 240, 1440, untrusted, 'ed')).toBe(
        0,
      );
      expect(
        await votingService.autoVote(0, 240, 1440, untrusted, 'mixed-ed'),
      ).toBe(0);
    });

    it("should reject an ending over 4 minutes in a 'full' episode", async () => {
      expect(await votingService.autoVote(0, 241, 1440, untrusted, 'ed')).toBe(
        -10,
      );
    });

    it("should keep the 3 minute limit for openings in a 'full' episode", async () => {
      expect(await votingService.autoVote(0, 187, 1440, untrusted, 'op')).toBe(
        -10,
      );
      expect(
        await votingService.autoVote(0, 187, 1440, untrusted, 'mixed-op'),
      ).toBe(-10);
      // v1 skip times without a type are treated as openings.
      expect(await votingService.autoVote(0, 187, 1440, untrusted)).toBe(-10);
    });

    it("should keep the other episode types' limits for endings", async () => {
      expect(await votingService.autoVote(0, 121, 719, untrusted, 'ed')).toBe(
        -10,
      );
    });
  });

  describe('autoVote for trusted submitters', () => {
    // Average of last ten skip times above 2 (see the mock above).
    const trusted = 'e93e3787-3071-4d1f-833f-a78755702f6b';
    const untrusted = '17ca2744-c222-4856-bc75-450498b1699e';

    it('should give trusted submitters 60 s over the limit', async () => {
      // 'full' opening limit is 180 s; trusted get 240 s.
      expect(await votingService.autoVote(0, 240, 1440, trusted, 'op')).toBe(1);
      expect(await votingService.autoVote(0, 241, 1440, trusted, 'op')).toBe(
        -10,
      );
      expect(await votingService.autoVote(0, 200, 1440, untrusted, 'op')).toBe(
        -10,
      );
    });

    it('should extend the ending limit for trusted submitters', async () => {
      // 'full' ending limit is 240 s; trusted get 300 s.
      expect(await votingService.autoVote(0, 300, 1440, trusted, 'ed')).toBe(1);
      expect(await votingService.autoVote(0, 301, 1440, trusted, 'ed')).toBe(
        -10,
      );
    });

    it("should extend the 'recap' limit for trusted submitters", async () => {
      // 'full' recap limit is 360 s; trusted get 420 s.
      expect(await votingService.autoVote(0, 420, 1440, trusted, 'recap')).toBe(
        1,
      );
      expect(
        await votingService.autoVote(0, 420, 1440, untrusted, 'recap'),
      ).toBe(-10);
    });

    it('should extend the limit for v1 skip times without a skip type', async () => {
      expect(await votingService.autoVote(0, 200, 1440, trusted)).toBe(1);
    });

    it('should still reject trusted skip times under 5 s', async () => {
      expect(await votingService.autoVote(10, 14, 1440, trusted, 'op')).toBe(
        -10,
      );
    });
  });
});
