import express from 'express';
import { getJobs, createJob } from '../controllers/jobController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getJobs)
  .post(createJob); // Open for easy seeding

export default router;
