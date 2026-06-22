import axios from 'axios';
import Job from '../models/Job.js';

// @desc    Get real-time jobs from JSearch API
// @route   GET /api/v1/jobs
// @access  Private
export const getJobs = async (req, res) => {
  try {
    const { search, location, workType, experienceLevel } = req.query;

    const mockJobs = [
      {
        job_id: "mock_1",
        job_title: "Senior Full Stack Developer",
        employer_name: "Tech Corp",
        job_is_remote: true,
        job_city: "",
        job_country: "",
        job_required_experience: { required_experience_in_months: 60 },
        job_min_salary: 1500000,
        job_max_salary: 2500000,
        job_posted_at_datetime_utc: new Date().toISOString(),
        job_apply_link: "#"
      },
      {
        job_id: "mock_2",
        job_title: "Frontend React Engineer",
        employer_name: "Innovate Solutions",
        job_is_remote: false,
        job_city: "Bangalore",
        job_country: "India",
        job_required_experience: { required_experience_in_months: 36 },
        job_min_salary: 1000000,
        job_max_salary: 1800000,
        job_posted_at_datetime_utc: new Date(Date.now() - 86400000).toISOString(),
        job_apply_link: "#"
      },
      {
        job_id: "mock_3",
        job_title: "Backend Node.js Developer",
        employer_name: "Serverless Inc",
        job_is_remote: true,
        job_city: "",
        job_country: "",
        job_required_experience: { required_experience_in_months: 48 },
        job_min_salary: 1200000,
        job_max_salary: 2000000,
        job_posted_at_datetime_utc: new Date(Date.now() - 172800000).toISOString(),
        job_apply_link: "#"
      }
    ];

    let apiJobs = mockJobs;

    if (process.env.RAPIDAPI_KEY) {
      let queryTerm = search || 'Developer';
      if (location) {
        queryTerm += ` in ${location}`;
      }

      const options = {
        method: 'GET',
        url: 'https://jsearch.p.rapidapi.com/search',
        params: {
          query: queryTerm,
          page: '1',
          num_pages: '1'
        },
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
        }
      };

      try {
        const response = await axios.request(options);
        if (response.data && response.data.data && response.data.data.length > 0) {
          apiJobs = response.data.data;
        }
      } catch (apiError) {
        console.error('RapidAPI Call Failed, falling back to mock jobs:', apiError.message);
      }
    } else {
      console.log('No RAPIDAPI_KEY found, using mock jobs.');
    }

    // Map JSearch response to our frontend structure
    const mappedJobs = apiJobs.map(job => {
      // Simulate AI Match Score between 70-99
      const matchScore = Math.floor(Math.random() * (99 - 70 + 1)) + 70; 

      return {
        _id: job.job_id,
        title: job.job_title,
        company: job.employer_name,
        location: job.job_city ? `${job.job_city}, ${job.job_country}` : (job.job_is_remote ? 'Remote' : 'Not specified'),
        workType: job.job_is_remote ? 'Remote' : 'On-site',
        experienceLevel: job.job_required_experience?.required_experience_in_months ? `${Math.floor(job.job_required_experience.required_experience_in_months / 12)} years` : 'Not specified',
        salaryRange: job.job_min_salary ? `₹${job.job_min_salary} - ₹${job.job_max_salary}` : 'Not Disclosed',
        requiredSkills: ['Teamwork', 'Communication'], // JSearch doesn't always provide skills easily, using defaults
        postedAt: job.job_posted_at_datetime_utc || new Date(),
        matchScore: matchScore,
        applyLink: job.job_apply_link
      };
    });

    // We can filter by workType if needed
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
