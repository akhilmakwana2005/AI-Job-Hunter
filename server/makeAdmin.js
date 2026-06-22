import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const makeAdmin = async () => {
  const email = process.argv[2];
  
  if (!email) {
    console.error('Please provide an email address as an argument.');
    console.log('Usage: node makeAdmin.js <user_email>');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ai-job-hunter');
    console.log('MongoDB Connected...');

    const user = await User.findOne({ email });

    if (!user) {
      console.error(`User with email ${email} not found.`);
      process.exit(1);
    }

    user.isAdmin = true;
    await user.save();

    console.log(`Success! User ${email} has been promoted to Admin.`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

makeAdmin();
