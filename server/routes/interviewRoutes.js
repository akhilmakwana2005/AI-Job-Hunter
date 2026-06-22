import express from 'express';
import { startInterview, submitAnswer, getInterviews } from '../controllers/interviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getInterviews);

router.route('/start')
  .post(protect, startInterview);

router.route('/:id/answer')
  .post(protect, submitAnswer);

export default router;
