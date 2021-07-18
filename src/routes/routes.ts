import express from 'express';

import apiDocs from './api_docs';
import rules from './rules';
import skipTimes from './skip_times';

const router = express.Router();

router.use('/api-docs', apiDocs);
router.use('/rules', rules);
router.use('/skip-times', skipTimes);

export default router;
