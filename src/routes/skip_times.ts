import express, { Request, Response } from 'express';
import { query, param, validationResult, body } from 'express-validator';
import db from '../db/db';
import {
  skipTimesInsertQuery,
  skipTimesSelectQuery,
  skipTimesUpvoteQuery,
  skipTimesDownvoteQuery,
} from '../db/db_queries';
import SkipTimesDatabaseType from '../types/db/db_types';

const router = express.Router();

/**
 * @openapi
 *
 * /skip-times/vote/{skip_id}:
 *   post:
 *     description: Upvotes or downvotes the skip time
 *     parameters:
 *       - name: skip_id
 *         in: path
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Skip time UUID
 *     requestBody:
 *       description: An object containing the skip time parameters
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vote_type:
 *                 type: string
 *                 enum: [upvote, downvote]
 *     responses:
 *       '200':
 *         description: Success message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum: [success]
 */
router.post(
  '/vote/:skip_id',
  param('skip_id').isUUID(),
  body('vote_type').isIn(['upvote', 'downvote']),
  async (req: Request, res: Response, next: CallableFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      res.json({ error: errors.array() });
    }

    try {
      const { skip_id } = req.params;
      const { vote_type } = req.body;

      if (vote_type === 'upvote') {
        await db.query(skipTimesUpvoteQuery, [skip_id]);
      } else {
        await db.query(skipTimesDownvoteQuery, [skip_id]);
      }

      res.status(200);
      res.json({
        message: 'success',
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @openapi
 *
 * /skip-times/{anime_id}/{episode_number}:
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
 *               type: object
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
 * @openapi
 *
 * /skip-times/{anime_id}/{episode_number}:
 *   post:
 *     description: Retrieves the opening or ending skip times for a specific anime episode
 *     parameters:
 *       - name: anime_id
 *         in: path
 *         schema:
 *           type: integer
 *           format: int64
 *         required: true
 *         description: MAL id of the anime to create a new skip time for
 *       - name: episode_number
 *         in: path
 *         schema:
 *           type: integer
 *           format: int64
 *         required: true
 *         description: Episode number of the anime to to create a new skip time for
 *     requestBody:
 *       description: An object containing the skip time parameters
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               skip_type:
 *                 type: string
 *                 enum: [op, ed]
 *               provider_name:
 *                 type: string
 *               start_time:
 *                 type: number
 *                 format: float
 *               end_time:
 *                 type: number
 *                 format: float
 *               episode_length:
 *                 type: number
 *                 format: float
 *               submitter_id:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       '200':
 *         description: Success message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum: [success]
 */
router.post(
  '/:anime_id/:episode_number',
  param('anime_id').isInt(),
  param('episode_number').isInt(),
  body('skip_type').isIn(['op', 'ed']),
  body('provider_name').isString(),
  body('start_time').isFloat(),
  body('end_time').isFloat(),
  body('episode_length').isFloat(),
  body('submitter_id').isString(),
  async (req: Request, res: Response, next: CallableFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      res.json({ error: errors.array() });
    }

    try {
      const { anime_id, episode_number } = req.params;
      const {
        provider_name,
        skip_type,
        start_time,
        end_time,
        episode_length,
        submitter_id,
      } = req.body;

      await db.query(skipTimesInsertQuery, [
        anime_id,
        episode_number,
        provider_name,
        skip_type,
        start_time,
        end_time,
        episode_length,
        submitter_id,
      ]);

      res.status(200);
      res.json({
        message: 'success',
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
