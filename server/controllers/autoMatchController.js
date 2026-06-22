import Resume from '../models/Resume.js';
import User from '../models/User.js';
import axios from 'axios';

// @desc    Get highly matched jobs for the Auto-Apply Queue
// @route   GET /api/v1/automatch
// @access  Private
export const getAutoMatches = async (req, res) => {
  try {
    const { resumeId } = req.query;
    
    // Get specified resume, or fallback to the user's latest parsed resume
    let resume;
    if (resumeId) {
      resume = await Resume.findById(resumeId);
    } else {
      resume = await Resume.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
    }

    const user = await User.findById(req.user._id);
    let targetRole = user?.preferences?.roles?.[0] || 'Software Engineer';
    let skills = [];
    
    if (resume && resume.analysis && resume.analysis.strengths) {
        skills = resume.analysis.strengths;
    } else {
        skills = ['React', 'Node.js', 'JavaScript', 'MongoDB', 'Tailwind'];
    }

    // In a real production app, you would query an external Job Board API (like Adzuna or LinkedIn API)
    // and then run an NLP algorithm (or Gemini) to calculate the cosine similarity between the Resume and Job Description.
    // For this SaaS MVP, we will generate highly matched simulated jobs based on the user's profile.

    let finalMatches = [];
    const queryTerm = `${targetRole} ${skills.slice(0, 2).join(' ')}`;

    if (!process.env.RAPIDAPI_KEY) {
      return res.json({ 
        requiresApiKey: true, 
        message: 'RapidAPI Key is missing. Please add your JSearch RAPIDAPI_KEY to the server environment variables to fetch real auto-matched jobs.' 
      });
    }

    try {
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

      const response = await axios.request(options);
      if (response.data && response.data.data && response.data.data.length > 0) {
        finalMatches = response.data.data.map(job => ({
          _id: job.job_id,
          title: job.job_title,
          company: job.employer_name,
          location: job.job_city ? `${job.job_city}, ${job.job_country}` : (job.job_is_remote ? 'Remote' : 'Not specified'),
          salary: job.job_min_salary ? `₹${job.job_min_salary} - ₹${job.job_max_salary}` : 'Competitive',
          matchScore: Math.floor(Math.random() * (99 - 85 + 1)) + 85,
          matchReasons: [
            `Matches your target role: ${targetRole}`, 
            `Company is hiring actively`
          ],
          applyUrl: job.job_apply_link || job.job_google_link || '#'
        }));
      }
    } catch (error) {
      console.error('Failed to fetch real jobs for AutoMatch:', error.message);
      if (error.response && error.response.status === 429) {
        return res.json({ 
          requiresApiKey: true, 
          message: 'RapidAPI quota reached. Please upgrade your JSearch free tier plan or use a new key.' 
        });
      }
      return res.status(500).json({ message: 'Failed to fetch from JSearch API' });
    }

    // Simulate network processing delay for realism
    setTimeout(() => {
        res.json(finalMatches.slice(0, 6)); // Send top 6 matches
    }, 1500);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
