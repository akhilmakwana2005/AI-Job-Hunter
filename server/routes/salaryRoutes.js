import express from 'express';
import { generateNegotiationEmail, getNegotiations } from '../controllers/salaryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getNegotiations);

router.route('/negotiate')
  .post(protect, generateNegotiationEmail);

export default router;
