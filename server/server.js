import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import coverLetterRoutes from './routes/coverLetterRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import linkedinRoutes from './routes/linkedinRoutes.js';
import networkingRoutes from './routes/networkingRoutes.js';
import salaryRoutes from './routes/salaryRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import autoMatchRoutes from './routes/autoMatchRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/resumes', resumeRoutes);
app.use('/api/v1/applications', applicationRoutes);
app.use('/api/v1/cover-letters', coverLetterRoutes);
app.use('/api/v1/interviews', interviewRoutes);
app.use('/api/v1/linkedin', linkedinRoutes);
app.use('/api/v1/networking', networkingRoutes);
app.use('/api/v1/salary', salaryRoutes);
app.use('/api/v1/payment', paymentRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/portfolio', portfolioRoutes);
app.use('/api/v1/automatch', autoMatchRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.send('AI Job Hunter Agent API is running');
});

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-job-hunter')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });
