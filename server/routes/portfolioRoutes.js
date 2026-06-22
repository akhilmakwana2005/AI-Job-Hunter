import express from 'express';
import { generatePortfolio } from '../controllers/portfolioController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/generate', protect, generatePortfolio);

export default router;
