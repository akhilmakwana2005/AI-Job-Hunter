import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  salaryRange: { type: String, required: true },
  description: { type: String, required: true },
  requiredSkills: [String],
  workType: {
    type: String,
    enum: ['remote', 'hybrid', 'onsite'],
    default: 'onsite'
  },
  experienceLevel: { type: String },
  logoUrl: { type: String },
  postedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Job = mongoose.model('Job', jobSchema);

export default Job;
