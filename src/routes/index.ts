import express from 'express';
import skipTimes from './skip_times';

const router = express.Router();

router.use('/skip-times', skipTimes);

export default router;
