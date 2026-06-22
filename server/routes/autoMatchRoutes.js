import express from 'express';
import { getAutoMatches } from '../controllers/autoMatchController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getAutoMatches);

export default router;
