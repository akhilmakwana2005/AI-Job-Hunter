import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  fileName: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String, // Mock URL for now
    default: '',
  },
  latestAtsScore: {
    type: Number,
    default: null,
  },
  extractedText: {
    type: String,
    default: '',
  },
  analysis: {
    strengths: [String],
    weaknesses: [String],
    missingKeywords: [String],
    suggestions: [String]
  }
}, { timestamps: true });

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;
