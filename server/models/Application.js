import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  company: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Saved', 'Applied', 'Interviewing', 'Offered', 'Rejected'],
    default: 'Applied',
  },
  location: {
    type: String,
  },
  salary: {
    type: String,
  },
  dateApplied: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
  },
  logoUrl: {
    type: String,
  },
  source: {
    type: String,
    default: 'Manual',
  }
}, { timestamps: true });

const Application = mongoose.model('Application', applicationSchema);

export default Application;
