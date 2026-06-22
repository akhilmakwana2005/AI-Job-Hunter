import express from 'express';
import { analyzeProfile, getAnalyses } from '../controllers/linkedinController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getAnalyses);

router.route('/analyze')
  .post(protect, analyzeProfile);

export default router;
