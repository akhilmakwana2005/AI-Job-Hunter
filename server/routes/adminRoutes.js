import express from 'express';
import { getAdminStats, promoteUserToPro } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', protect, admin, getAdminStats);
router.put('/users/:id/promote', protect, admin, promoteUserToPro);

export default router;
