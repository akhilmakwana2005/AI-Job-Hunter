import express from 'express';
import { getAdminStats } from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// For a real app, add an 'admin' middleware here. 
// We are using 'protect' so the owner can access it easily during demo.
router.get('/stats', protect, getAdminStats);

export default router;
