import express, { Request, Response } from 'express';
import { param } from 'express-validator';

import { validationHandler } from '../../middlewares';
import rules from './rules';

const router = express.Router();

router.get(
  '/:anime_id',
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
