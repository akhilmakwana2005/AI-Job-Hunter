import express from 'express';
import { generateMessage, getMessages } from '../controllers/networkingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getMessages);

router.route('/generate')
  .post(generateMessage);

export default router;
