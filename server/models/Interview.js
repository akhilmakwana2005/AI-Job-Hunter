import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  role: {
    type: String,
    required: true,
  },
  questions: [{
    questionText: String,
    userAnswer: String,
    feedback: String,
    score: Number // 1-10
  }],
  currentQuestionIndex: {
    type: Number,
    default: 0
  },
  overallScore: {
    type: Number,
    default: null
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed'],
    default: 'in-progress'
  }
}, { timestamps: true });

const Interview = mongoose.model('Interview', interviewSchema);

export default Interview;
