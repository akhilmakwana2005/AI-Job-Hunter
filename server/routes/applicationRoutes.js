import express from 'express';
import { 
  getApplications, 
  addApplication, 
  updateApplication, 
  deleteApplication 
} from '../controllers/applicationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getApplications)
  .post(protect, addApplication);

router.route('/:id')
  .put(protect, updateApplication)
  .delete(protect, deleteApplication);

export default router;
