import express from 'express';
import { upgradeToPro } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/upgrade', protect, upgradeToPro);

export default router;
