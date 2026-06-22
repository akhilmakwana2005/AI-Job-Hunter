import mongoose from 'mongoose';

const salaryNegotiationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    companyName: {
      type: String,
      required: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
    offeredSalary: {
      type: String,
      required: true,
    },
    targetSalary: {
      type: String,
      required: true,
    },
    emailContent: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

const SalaryNegotiation = mongoose.model('SalaryNegotiation', salaryNegotiationSchema);
export default SalaryNegotiation;
