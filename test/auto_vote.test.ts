import autoVote from '../src/auto_vote';
import db from '../src/db';
import { skipTimesInsertNoDefaultsQuery } from '../src/db/db_queries';

afterAll(() => db.close());

describe('autovote', () => {
  beforeAll(async () => {
    await db.query(skipTimesInsertNoDefaultsQuery, [
      'c9dfd857-0351-4a90-b37e-582a44253912',
      1,
      1,
      'ProviderName',
      'op',
      3,
      208,
      298.556,
      1435.122,
      '2021-02-19 02:14:22.872759',
      'e93e3787-3071-4d1f-833f-a78755702f6b',
    ]);

    await db.query(skipTimesInsertNoDefaultsQuery, [
      'c9dfd857-0351-4a90-b37e-582a44253911',
      1,
      1,
      'ProviderName',
      'op',
      4,
      208,
      298.556,
      1435.122,
      '2021-02-19 02:14:22.872759',
      'e93e3787-3071-4d1f-833f-a78755702f6b',
    ]);
  });

  it("detects a bad skip time in a 'full' episode", async (done) => {
    const votes = await autoVote(
      0,
      0,
      1440,
      '17ca2744-c222-4856-bc75-450498b1699e'
    );
    expect(votes).toBe(-10);
    done();
  });

  it("detects a bad skip time in a 'full' episode", async (done) => {
    const votes = await autoVote(
      1,
      1.5,
      1440,
      '17ca2744-c222-4856-bc75-450498b1699e'
    );
    expect(votes).toBe(-10);
    done();
  });

  it("detects a bad skip time in a 'full' episode", async (done) => {
    const votes = await autoVote(
      0,
      1000,
      1440,
      '17ca2744-c222-4856-bc75-450498b1699e'
    );
    expect(votes).toBe(-10);
    done();
  });

  it("detects a bad skip time in a 'full' episode", async (done) => {
    const votes = await autoVote(
      0,
      1440,
      1440,
      '17ca2744-c222-4856-bc75-450498b1699e'
    );
    expect(votes).toBe(-10);
    done();
  });

  it('detects a user with good reputation', async (done) => {
    const votes = await autoVote(
      130,
      210,
      1440,
      'e93e3787-3071-4d1f-833f-a78755702f6b'
    );
    expect(votes).toBe(1);
    done();
  });

  it("detects a normal skip time in a 'full' episode", async (done) => {
    const votes = await autoVote(
      130,
      210,
      1440,
      '17ca2744-c222-4856-bc75-450498b1699e'
    );
    expect(votes).toBe(0);
    done();
  });

  it("detects a bad skip time in a 'short' episode", async (done) => {
    const votes = await autoVote(
      0,
      55,
      118,
      '17ca2744-c222-4856-bc75-450498b1699e'
    );
    expect(votes).toBe(-10);
    done();
  });

  it("detects a normal skip time in a 'short' episode", async (done) => {
    const votes = await autoVote(
      30,
      55,
      119,
      '17ca2744-c222-4856-bc75-450498b1699e'
    );
    expect(votes).toBe(0);
    done();
  });

  it("detects a bad skip time in a 'half' episode", async (done) => {
    const votes = await autoVote(
      0,
      240,
      719,
      '17ca2744-c222-4856-bc75-450498b1699e'
    );
    expect(votes).toBe(-10);
    done();
  });

  it("detects a normal skip time in a 'half' episode", async (done) => {
    const votes = await autoVote(
      100,
      160,
      719,
      '17ca2744-c222-4856-bc75-450498b1699e'
    );
    expect(votes).toBe(0);
    done();
  });

  it("detects a bad skip time in a 'movie' episode", async (done) => {
    const votes = await autoVote(
      0,
      960,
      5400,
      '17ca2744-c222-4856-bc75-450498b1699e'
    );
    expect(votes).toBe(-10);
    done();
  });

  it("detects a normal skip time in a 'movie' episode", async (done) => {
    const votes = await autoVote(
      0,
      420,
      5400,
      '17ca2744-c222-4856-bc75-450498b1699e'
    );
    expect(votes).toBe(0);
    done();
  });
});
