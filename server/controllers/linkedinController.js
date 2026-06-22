import LinkedinAnalysis from '../models/LinkedinAnalysis.js';

import { generateAIResponse } from '../utils/aiHandler.js';

// @desc    Analyze LinkedIn Profile
// @route   POST /api/v1/linkedin/analyze
// @access  Private
export const analyzeProfile = async (req, res) => {
  try {
    const { profileText, profileName } = req.body;
    
    if (!profileText || profileText.length < 50) {
      return res.status(400).json({ message: 'Please provide enough text from your LinkedIn profile for analysis.' });
    }

    const prompt = `You are an expert LinkedIn profile optimizer and technical recruiter. 
    Review the following pasted text from a candidate's LinkedIn profile:
    
    "${profileText.substring(0, 4000)}"
    
    Analyze the headline, the about section, and the experience section. 
    Return EXACTLY a JSON object with this structure and NO markdown around it:
    {
      "score": (overall score between 0 and 100),
      "analysis": {
        "headline": {
          "score": (score 0-100),
          "feedback": "1 sentence feedback",
          "suggestions": ["Suggestion 1", "Suggestion 2"]
        },
        "about": {
          "score": (score 0-100),
          "feedback": "1 sentence feedback",
          "suggestions": ["Suggestion 1", "Suggestion 2"]
        },
        "experience": {
          "score": (score 0-100),
          "feedback": "1 sentence feedback",
          "suggestions": ["Suggestion 1", "Suggestion 2"]
        },
        "overallFeedback": ["Overall advice 1", "Overall advice 2", "Overall advice 3"]
      }
    }`;

    const aiResponse = await generateAIResponse(prompt);
    let mockAnalysis;

    if (aiResponse) {
      try {
        mockAnalysis = JSON.parse(aiResponse.trim().replace(/```json/g, '').replace(/```/g, ''));
      } catch (e) {
        console.error('Failed to parse LinkedIn JSON', e);
      }
    }

    if (!mockAnalysis) {
      // Fallback
      mockAnalysis = {
        score: 75,
        analysis: {
          headline: { score: 70, feedback: 'Okay, but needs more keywords.', suggestions: ['Add a value proposition.'] },
          about: { score: 70, feedback: 'A bit generic.', suggestions: ['Use first person.'] },
          experience: { score: 80, feedback: 'Good details.', suggestions: ['Add more metrics.'] },
          overallFeedback: ['Expand your network.', 'Add certifications.']
        }
      };
    }

    // Save to database
    const analysisRecord = await LinkedinAnalysis.create({
      userId: req.user._id,
      profileName: profileName || 'My Profile',
      score: mockAnalysis.score,
      analysis: mockAnalysis.analysis
    });

    res.status(201).json(analysisRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's past analyses
// @route   GET /api/v1/linkedin
// @access  Private
export const getAnalyses = async (req, res) => {
  try {
    const analyses = await LinkedinAnalysis.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(analyses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
