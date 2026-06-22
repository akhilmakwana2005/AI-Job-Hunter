import axios from 'axios';
import Job from '../models/Job.js';

// @desc    Get real-time jobs from JSearch API
// @route   GET /api/v1/jobs
// @access  Private
export const getJobs = async (req, res) => {
  try {
    const { search, location, workType, experienceLevel } = req.query;

    let apiJobs = [];
    
    if (!process.env.RAPIDAPI_KEY) {
      return res.json({ 
        requiresApiKey: true, 
        message: 'RapidAPI Key is missing. Please add your JSearch RAPIDAPI_KEY to the server environment variables to fetch real jobs.' 
      });
    }

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
      console.error('RapidAPI Call Failed:', apiError.message);
      if (apiError.response && apiError.response.status === 429) {
        return res.json({ 
          requiresApiKey: true, 
          message: 'RapidAPI quota reached. Please upgrade your JSearch free tier plan or use a new key.' 
        });
      }
      throw new Error('Failed to fetch from JSearch API');
    }

    // Map JSearch response to our frontend structure
    const mappedJobs = apiJobs.map(job => {
      const matchScore = Math.floor(Math.random() * (99 - 70 + 1)) + 70; 

      return {
        _id: job.job_id,
        title: job.job_title,
        company: job.employer_name,
        location: job.job_city ? `${job.job_city}, ${job.job_country}` : (job.job_is_remote ? 'Remote' : 'Not specified'),
        workType: job.job_is_remote ? 'Remote' : 'On-site',
        experienceLevel: job.job_required_experience?.required_experience_in_months ? `${Math.floor(job.job_required_experience.required_experience_in_months / 12)} years` : 'Not specified',
        salaryRange: job.job_min_salary ? `₹${job.job_min_salary} - ₹${job.job_max_salary}` : 'Not Disclosed',
        requiredSkills: ['Teamwork', 'Communication'], 
        postedAt: job.job_posted_at_datetime_utc || new Date(),
        matchScore: matchScore,
        applyLink: job.job_apply_link
      };
    });

    let finalJobs = mappedJobs;
    if (workType && workType !== 'any') {
      finalJobs = finalJobs.filter(j => j.workType.toLowerCase() === workType.toLowerCase());
    }
    if (experienceLevel) {
      // Simulate experience level filtering by checking if the title contains the level
      const levelStr = experienceLevel.split('-')[0].toLowerCase();
      finalJobs = finalJobs.filter(j => {
        if (levelStr === 'any') return true;
        if (levelStr === 'entry') return j.title.toLowerCase().includes('junior') || j.title.toLowerCase().includes('entry');
        if (levelStr === 'mid') return !j.title.toLowerCase().includes('senior') && !j.title.toLowerCase().includes('lead') && !j.title.toLowerCase().includes('junior');
        if (levelStr === 'senior') return j.title.toLowerCase().includes('senior') || j.title.toLowerCase().includes('sr');
        if (levelStr === 'lead/manager') return j.title.toLowerCase().includes('lead') || j.title.toLowerCase().includes('manager') || j.title.toLowerCase().includes('head');
        return true;
      });
      
      // If filtering resulted in 0 jobs (too strict), just return all mappedJobs to avoid empty states
      if (finalJobs.length === 0) finalJobs = mappedJobs;
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
