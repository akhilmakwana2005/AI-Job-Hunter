import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Job from './models/Job.js';

dotenv.config();

const dummyJobs = [
  {
    title: 'Senior Product Designer',
    company: 'Stripe',
    location: 'San Francisco, CA',
    salaryRange: '$150,000 - $220,000',
    description: 'Looking for a Senior Product Designer to help shape the future of internet commerce...',
    requiredSkills: ['Figma', 'UI/UX', 'Design Systems', 'Prototyping'],
    workType: 'hybrid',
    experienceLevel: 'Senior',
  },
  {
    title: 'Full Stack Engineer',
    company: 'Vercel',
    location: 'Remote',
    salaryRange: '$130,000 - $180,000',
    description: 'Join the Next.js core team to build the next generation of web frameworks...',
    requiredSkills: ['React', 'Next.js', 'TypeScript', 'Node.js'],
    workType: 'remote',
    experienceLevel: 'Mid-Level',
  },
  {
    title: 'Frontend Developer',
    company: 'Linear',
    location: 'Remote',
    salaryRange: '$110,000 - $160,000',
    description: 'We are looking for a craft-focused frontend developer to build snappy UIs...',
    requiredSkills: ['React', 'TypeScript', 'GraphQL', 'Tailwind CSS'],
    workType: 'remote',
    experienceLevel: 'Mid-Level',
  },
  {
    title: 'Backend Systems Engineer',
    company: 'Airbnb',
    location: 'Seattle, WA',
    salaryRange: '$160,000 - $240,000',
    description: 'Build robust microservices that power millions of bookings...',
    requiredSkills: ['Java', 'Spring Boot', 'Kafka', 'Kubernetes'],
    workType: 'onsite',
    experienceLevel: 'Senior',
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-job-hunter');
    console.log('MongoDB Connected.');
    
    await Job.deleteMany(); // Clear existing jobs
    await Job.insertMany(dummyJobs);
    
    console.log('Jobs seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding jobs:', error);
    process.exit(1);
  }
};

seedData();
