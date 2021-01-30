import express, { Request, Response } from 'express';
import pool from '../queries';
const router = express.Router();

/**
 * GET segment for a specific anime episode
 * Parameter:
 *  anime_id : MAL anime id
 *  episode_number: Episode number of anime to GET
 */
router.get('/skipTimes', async (req: Request, res: Response) => {
  const { anime_id, episode_number } = req.params;
  const values = [anime_id, episode_number];
  const client = await pool.connect();
  try {
    // Gets segment with most votes matching anime_id and episode_number specified
    const query = `select table1.*
      from skip_times table1
      left outer join skip_times table2
      on (table1.anime_id = table2.anime_id and table1.episode_number = table2.episode_number and table1.skip_type = table2.skip_type and table1.votes < table2.votes)
      where table2.anime_id is null and table1.anime_id = $1 and table1.episode_number = $2 
      order by anime_id`;
    const qresponse = await pool.query(query, values);
    res.status(200);
    res.json(qresponse);
  } catch {}
  client.release();
});

// POST new skip segment
router.post('/skipTimes', async (req: Request, res: Response) => {
  let {
    anime_id,
    episode_number,
    provider_name,
    skip_type,
    votes,
    start_time,
    end_time,
    episode_length,
    submitter_id,
  } = req.params;
  const values = [
    anime_id,
    episode_number,
    provider_name,
    skip_type,
    votes,
    start_time,
    end_time,
    episode_length,
    submitter_id,
  ];
  const client = await pool.connect();
  try {
    // Gets segment with most votes
    const query =
      'INSERT INTO skip_times VALUES ($1,$2,$3,$4,$5,$6,$7,"extract(epoch from now())",$8)';
    const qresponse = await pool.query(query, values);
    res.status(200);
    res.json(qresponse);
  } catch {}
  client.release();
});

export default router;
