import axios from 'axios';
import Job from '../models/Job.js';

// @desc    Get real-time jobs from JSearch API
// @route   GET /api/v1/jobs
// @access  Private
export const getJobs = async (req, res) => {
  try {
    const { search, location, workType } = req.query;

    const mockJobs = [
      { job_id: "mock_1", job_title: "Senior Full Stack Developer", employer_name: "Tech Corp", job_is_remote: true, job_city: "", job_country: "", job_required_experience: { required_experience_in_months: 60 }, job_min_salary: 1500000, job_max_salary: 2500000, job_posted_at_datetime_utc: new Date().toISOString(), job_apply_link: "#" },
      { job_id: "mock_2", job_title: "Frontend React Engineer", employer_name: "Innovate Solutions", job_is_remote: false, job_city: "Bangalore", job_country: "India", job_required_experience: { required_experience_in_months: 36 }, job_min_salary: 1000000, job_max_salary: 1800000, job_posted_at_datetime_utc: new Date(Date.now() - 86400000).toISOString(), job_apply_link: "#" },
      { job_id: "mock_3", job_title: "Backend Node.js Developer", employer_name: "Serverless Inc", job_is_remote: true, job_city: "", job_country: "", job_required_experience: { required_experience_in_months: 48 }, job_min_salary: 1200000, job_max_salary: 2000000, job_posted_at_datetime_utc: new Date(Date.now() - 172800000).toISOString(), job_apply_link: "#" }
    ];

    let apiJobs = [];
    let queryTerm = search ? search.toLowerCase() : 'developer';
    
    // Use Remotive API (No API Key required, no strict rate limit)
    try {
      const response = await axios.get(`https://remotive.com/api/remote-jobs?search=${encodeURIComponent(queryTerm)}&limit=15`);
      if (response.data && response.data.jobs && response.data.jobs.length > 0) {
        apiJobs = response.data.jobs;
      }
    } catch (apiError) {
      console.error('Remotive API Call Failed, falling back to mock jobs:', apiError.message);
    }

    if (apiJobs.length === 0) {
      apiJobs = mockJobs;
    }

    // Map Remotive (or Mock) response to our frontend structure
    const mappedJobs = apiJobs.map(job => {
      // If it's a mock job, use its properties, otherwise use Remotive's properties
      const isMock = !!job.job_id;
      
      const matchScore = Math.floor(Math.random() * (99 - 70 + 1)) + 70; 

      return {
        _id: isMock ? job.job_id : String(job.id),
        title: isMock ? job.job_title : job.title,
        company: isMock ? job.employer_name : job.company_name,
        location: isMock ? (job.job_city ? `${job.job_city}, ${job.job_country}` : 'Remote') : (job.candidate_required_location || 'Remote'),
        workType: isMock ? (job.job_is_remote ? 'Remote' : 'On-site') : 'Remote',
        experienceLevel: isMock ? (job.job_required_experience?.required_experience_in_months ? `${Math.floor(job.job_required_experience.required_experience_in_months / 12)} years` : 'Not specified') : 'Not specified',
        salaryRange: isMock ? (job.job_min_salary ? `₹${job.job_min_salary} - ₹${job.job_max_salary}` : 'Not Disclosed') : (job.salary || 'Competitive'),
        requiredSkills: ['Teamwork', 'Communication'], 
        postedAt: isMock ? job.job_posted_at_datetime_utc : job.publication_date,
        matchScore: matchScore,
        applyLink: isMock ? job.job_apply_link : job.url
      };
    });

    let finalJobs = mappedJobs;
    if (workType && workType !== 'any') {
      finalJobs = finalJobs.filter(j => j.workType.toLowerCase() === workType.toLowerCase());
    }

    res.json(finalJobs);

  } catch (error) {
    console.error('Job API Error:', error.message);
    res.status(500).json({ message: 'Failed to fetch jobs. Please try again later.' });
  }
};

// @desc    Create a mock job (for testing)
// @route   POST /api/v1/jobs
// @access  Public
export const createJob = async (req, res) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
