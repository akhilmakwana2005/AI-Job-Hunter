import express from 'express';
import multer from 'multer';
import { analyzeResume, getResumes, getSkillGap, rewriteResume, recreateResume } from '../controllers/resumeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.route('/')
  .get(protect, getResumes);

router.route('/analyze')
  .post(protect, upload.single('resumeFile'), analyzeResume);

router.route('/skill-gap')
  .get(protect, getSkillGap);

router.route('/rewrite')
  .post(protect, rewriteResume);

router.route('/recreate')
  .post(protect, recreateResume);

export default router;
