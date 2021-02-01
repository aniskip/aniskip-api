import express from 'express';
import skipTimes from './skip_times';
import apiDocs from './api_docs';

const router = express.Router();

router.use('/skip-times', skipTimes);

if (process.env.NODE_ENV === 'development') {
  router.use('/api-docs', apiDocs);
}

export default router;
