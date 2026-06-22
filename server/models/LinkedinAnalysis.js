import mongoose from 'mongoose';

const linkedinSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  profileUrl: {
    type: String,
    required: false,
  },
  profileName: {
    type: String,
    default: 'My LinkedIn Profile'
  },
  score: {
    type: Number,
    required: true,
  },
  analysis: {
    headline: {
      score: Number,
      feedback: String,
      suggestions: [String]
    },
    about: {
      score: Number,
      feedback: String,
      suggestions: [String]
    },
    experience: {
      score: Number,
      feedback: String,
      suggestions: [String]
    },
    overallFeedback: [String]
  }
}, { timestamps: true });

const LinkedinAnalysis = mongoose.model('LinkedinAnalysis', linkedinSchema);

export default LinkedinAnalysis;
