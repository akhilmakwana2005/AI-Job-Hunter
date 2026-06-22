import mongoose from 'mongoose';

const coverLetterSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  targetCompany: {
    type: String,
    required: true,
  },
  targetRole: {
    type: String,
    required: true,
  },
  jobDescription: {
    type: String,
  },
  content: {
    type: String,
    required: true,
  }
}, { timestamps: true });

const CoverLetter = mongoose.model('CoverLetter', coverLetterSchema);

export default CoverLetter;
