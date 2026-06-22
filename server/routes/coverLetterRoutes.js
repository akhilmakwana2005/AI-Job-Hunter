import express from 'express';
import { generateCoverLetter, getCoverLetters } from '../controllers/coverLetterController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getCoverLetters);

router.route('/generate')
  .post(protect, generateCoverLetter);

export default router;
