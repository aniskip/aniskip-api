import express, { Request, Response } from 'express';
import { param } from 'express-validator';
import rateLimit from 'express-rate-limit';

import { validationHandler } from '../../middlewares';
import rules from './rules';
import { getStore, handler } from '../../rate_limit';

const router = express.Router();

/**
 * @openapi
 *
 * /rules/{anime_id}:
 *   get:
 *     description: Retrieves anime episode number redirection rules
 *     tags:
 *       - rules
 *     parameters:
 *       - name: anime_id
 *         in: path
 *         schema:
 *           type: integer
 *           format: int64
 *           minimum: 1
 *         required: true
 *         description: MAL id of the anime to get rules for
 *     responses:
 *       '200':
 *         description: Rules object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 found:
 *                   type: boolean
 *                   enum: [true]
 *                 rules:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       from:
 *                         type: object
 *                         required: ['start']
 *                         properties:
 *                           start:
 *                             type: integer
 *                             format: int64
 *                             minimum: 1
 *                           end:
 *                             type: integer
 *                             format: int64
 *                             minimum: 1
 *                       to:
 *                         type: object
 *                         required: ['start', 'malId']
 *                         properties:
 *                           malId:
 *                             type: integer
 *                             format: int64
 *                             minimum: 1
 *                           start:
 *                             type: integer
 *                             format: int64
 *                             minimum: 1
 *                           end:
 *                             type: integer
 *                             format: int64
 *                             minimum: 1
 */
router.get(
  '/:anime_id',
  rateLimit({
    windowMs: 1000 * 60, // 1 min
    max: 120,
    store: getStore('get-rule:', 60),
    handler,
  }),
  param('anime_id').isInt({ min: 1 }),
  validationHandler,
  (req: Request, res: Response) => {
    const animeId = parseInt(req.params.anime_id, 10);
    const episodeRules = rules.get(animeId);
    res.status(200);
    res.json({
      found: episodeRules.length !== 0,
      rules: episodeRules,
    });
  }
);

export default router;
