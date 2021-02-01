import express, { Request, Response } from 'express';
import { query, param, validationResult } from 'express-validator';
import db from '../db/db';
import { skipTimesInsertQuery, skipTimesSelectQuery } from '../db/db_queries';
import SkipTimesDatabaseType from '../types/db/db_types';

const router = express.Router();

/**
 * /{anime_id}/{episode_number}
 *   get:
 *     description: Retrieves the opening or ending skip times for a specific anime episode
 *     parameters:
 *       - name: anime_id
 *         in: path
 *         schema:
 *           type: integer
 *           format: int64
 *         required: true
 *         description: MAL id of the anime to get
 *       - name: episode_number
 *         in: path
 *         schema:
 *           type: integer
 *           format: int64
 *         required: true
 *         description: Episode number to get
 *       - name: type
 *         in: query
 *         schema:
 *           type: string
 *           enum: [op, ed]
 *         required: true
 *         description: Type of skip time to get
 *     responses:
 *       '200':
 *         description: Skip times object
 *         content:
 *           application/json:
 *             schema:
 *               type:object
 *               properties:
 *                 found:
 *                   type: boolean
 *                 result:
 *                   type: object
 *                   properties:
 *                     skip_times:
 *                       type: object
 *                       properties:
 *                         start_time:
 *                           type: number
 *                           format: float
 *                         end_time:
 *                           type: number
 *                           format: float
 *                     skip_id:
 *                       type: string
 *                       format: uuid
 *                     episode_length:
 *                       type: number
 *                       format: float
 */
router.get(
  '/:anime_id/:episode_number',
  param('anime_id').isInt(),
  param('episode_number').isInt(),
  query('type').isIn(['op', 'ed']),
  async (req: Request, res: Response, next: CallableFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      res.json({ error: errors.array() });
    }

    const { anime_id, episode_number } = req.params;
    const type = req.query.type as string;
    try {
      const { rows } = await db.query<SkipTimesDatabaseType>(
        skipTimesSelectQuery,
        [anime_id, episode_number, type]
      );
      res.status(200);
      if (rows.length > 0) {
        const { skip_id, start_time, end_time, episode_length } = rows[0];
        res.json({
          found: true,
          result: {
            skip_times: {
              start_time,
              end_time,
            },
            skip_id,
            episode_length,
          },
        });
      }
      res.json({ found: false });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * /{anime_id}/{episode_number}
 *   post:
 *     description: Creates a new skip time entry for the opening or ending for a specific anime episode
 *     parameters:
 *       - name: anime_id
 *         in: path
 *         schema:
 *           type: integer
 *           format: int64
 *         required: true
 *         description: MAL id of the anime to get
 *       - name: episode_number
 *         in: path
 *         schema:
 *           type: integer
 *           format: int64
 *         required: true
 *         description: Episode number to get
 *       - name: episode_type
 *         in: query
 *         schema:
 *           type: string
 *           enum: [op, ed]
 *         required: true
 *         description: Type of skip time to get
 *     responses:
 *       '200':
 *         description: Skip times object
 *         content:
 *           application/json:
 *             schema:
 *               type:object
 *               properties:
 *                 found:
 *                   type: boolean
 *                 result:
 *                   type: object
 *                   properties:
 *                     skip_times:
 *                       type: object
 *                       properties:
 *                         start_time:
 *                           type: number
 *                           format: float
 *                         end_time:
 *                           type: number
 *                           format: float
 *                     skip_id:
 *                       type: string
 *                       format: uuid
 *                     episode_length:
 *                       type: number
 *                       format: float
 */
router.post(
  '/:anime_id/:episode_number',
  param('anime_id').isInt(),
  param('episode_number').isInt(),
  query('skip_type').isIn(['op', 'ed']),
  query('provider_name').isString(),
  query('start_time').isFloat(),
  query('end_time').isFloat(),
  query('episode_length').isFloat(),
  query('submitter_id').isString(),
  async (req: Request, res: Response, next: CallableFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      res.json({ error: errors.array() });
    }

    try {
      const { anime_id, episode_number } = req.params;
      const providerName = req.query.provider_name as string;
      const skipType = req.query.skip_type as 'op' | 'ed';
      const startTime = req.query.start_time as string;
      const endTime = req.query.end_time as string;
      const episodeLength = req.query.episode_length as string;
      const submitterId = req.query.submitter_id as string;
      await db.query(skipTimesInsertQuery, [
        anime_id,
        episode_number,
        providerName,
        skipType,
        startTime,
        endTime,
        episodeLength,
        submitterId,
      ]);
      res.json({
        anime_id,
        episode_number,
        start_time: startTime,
        end_time: endTime,
        episode_length: episodeLength,
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
