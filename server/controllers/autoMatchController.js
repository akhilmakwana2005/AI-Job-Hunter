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

    const mockMatches = [
      { _id: 'auto_1', title: `Senior ${targetRole}`, company: 'Google', location: 'Remote', salary: '₹35L - ₹45L', matchScore: 96, matchReasons: ['Matches your 5+ years experience', `Requires ${skills[0] || 'Frontend'} which is your top skill`, 'Remote preference matches'], applyUrl: 'https://careers.google.com' },
      { _id: 'auto_2', title: targetRole, company: 'Stripe', location: 'Bangalore / Hybrid', salary: '₹28L - ₹40L', matchScore: 92, matchReasons: [`Strong overlap with your ${skills[1] || 'Backend'} skills`, 'Fintech domain matches your previous role'], applyUrl: 'https://stripe.com/jobs' },
      { _id: 'auto_3', title: `Lead ${targetRole}`, company: 'Microsoft', location: 'Hyderabad', salary: '₹30L - ₹50L', matchScore: 89, matchReasons: ['Leadership experience required', 'Tech stack aligns perfectly with your resume'], applyUrl: 'https://careers.microsoft.com' },
      { _id: 'auto_4', title: `${targetRole}`, company: 'Atlassian', location: 'Remote', salary: '₹25L - ₹35L', matchScore: 85, matchReasons: ['Remote work available', `Requires knowledge of ${skills[2] || 'Databases'} which you possess`], applyUrl: 'https://atlassian.com/company/careers' },
      { _id: 'auto_5', title: `Staff ${targetRole}`, company: 'Uber', location: 'Bangalore', salary: '₹40L - ₹60L', matchScore: 82, matchReasons: ['Mobility domain experience preferred', 'Requires high scale system design knowledge'], applyUrl: 'https://uber.com/careers' },
      { _id: 'auto_6', title: `Product ${targetRole}`, company: 'Airbnb', location: 'Remote', salary: '₹30L - ₹45L', matchScore: 88, matchReasons: [`Excellent match for ${skills[0] || 'your core'} skills`, 'Focuses on user experience and scale'], applyUrl: 'https://careers.airbnb.com' },
      { _id: 'auto_7', title: `${targetRole} II`, company: 'Amazon', location: 'Chennai', salary: '₹22L - ₹38L', matchScore: 94, matchReasons: ['Matches your cloud infrastructure skills', 'E-commerce background is a plus'], applyUrl: 'https://amazon.jobs' },
      { _id: 'auto_8', title: `Principal ${targetRole}`, company: 'Netflix', location: 'Remote', salary: '₹50L - ₹80L', matchScore: 80, matchReasons: ['Streaming technology familiarity required', `Uses ${skills[1] || 'your tech stack'}`], applyUrl: 'https://jobs.netflix.com' },
      { _id: 'auto_9', title: `${targetRole} - Platform Team`, company: 'Spotify', location: 'Mumbai / Hybrid', salary: '₹25L - ₹40L', matchScore: 86, matchReasons: ['Music tech domain', 'Requires strong API design knowledge'], applyUrl: 'https://lifeatspotify.com' },
      { _id: 'auto_10', title: `Core ${targetRole}`, company: 'Meta', location: 'Gurgaon', salary: '₹35L - ₹55L', matchScore: 91, matchReasons: ['Requires deep understanding of React/GraphQL', 'Social media scaling challenges'], applyUrl: 'https://metacareers.com' }
    ];

    let finalMatches = mockMatches;

    if (process.env.RAPIDAPI_KEY) {
      try {
        const queryTerm = `${targetRole} ${skills.slice(0, 2).join(' ')}`;
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
        console.error('Failed to fetch real jobs for AutoMatch, using mocks:', error.message);
      }
    }

    // Simulate network processing delay for realism
    setTimeout(() => {
        res.json(finalMatches.slice(0, 6)); // Send top 6 matches
    }, 1500);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
