import CoverLetter from '../models/CoverLetter.js';
import User from '../models/User.js';
import { generateAIResponse } from '../utils/aiHandler.js';

// @desc    Generate Cover Letter
// @route   POST /api/v1/cover-letters/generate
// @access  Private
export const generateCoverLetter = async (req, res) => {
  try {
    const { targetCompany, targetRole, jobDescription } = req.body;
    
    // Fetch user to use their profile context
    const user = await User.findById(req.user._id);

    // AI Prompt Construction
    const prompt = `Write a professional cover letter for the role of ${targetRole} at ${targetCompany}. 
    The applicant's name is ${user.fullName}. 
    Their experience level is ${user.profile?.experienceLevel || 'professional'}.
    Here is the job description (if provided): ${jobDescription || 'Make it a general strong software engineering cover letter.'}
    Make it highly persuasive, concise (max 3 paragraphs), and highlight modern technical skills. Do not include placeholders for addresses, start directly with "Dear Hiring Manager,".`;

    // Try generating with Real AI
    let generatedContent = await generateAIResponse(prompt);

    // Fallback if AI fails or Key is missing
    if (!generatedContent) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      generatedContent = `Dear Hiring Manager at ${targetCompany},\n\nI am writing to express my strong interest in the ${targetRole} position at ${targetCompany}. With my background in ${user.profile?.experienceLevel || 'software development'} and my passion for building scalable, user-centric applications, I am confident in my ability to make a significant impact on your team.\n\nThroughout my career, I have honed my skills in modern web technologies, specifically matching the requirements mentioned in your job description. I am particularly drawn to ${targetCompany}'s innovative approach and believe my technical expertise aligns perfectly with your goals.\n\nI would welcome the opportunity to discuss how my background, skills, and certifications will be of added value to ${targetCompany}. Thank you for your time and consideration.\n\nSincerely,\n\n${user.fullName}`;
    }

    // Save to database
    const coverLetter = await CoverLetter.create({
      userId: req.user._id,
      targetCompany,
      targetRole,
      jobDescription,
      content: generatedContent
    });

    res.status(201).json(coverLetter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's past cover letters
// @route   GET /api/v1/cover-letters
// @access  Private
export const getCoverLetters = async (req, res) => {
  try {
    const coverLetters = await CoverLetter.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(coverLetters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
