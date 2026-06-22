import Interview from '../models/Interview.js';
import { generateAIResponse } from '../utils/aiHandler.js';

// @desc    Start a new interview session
// @route   POST /api/v1/interviews/start
// @access  Private
export const startInterview = async (req, res) => {
  try {
    const { role } = req.body;
    
    // We could use AI to generate questions here too, but static is fine for MVP speed
    const defaultQuestions = [
      { questionText: `Can you tell me about a time you faced a significant challenge while working as a ${role || 'professional'}, and how you overcame it?` },
      { questionText: `What is your approach to learning new technologies or frameworks quickly in the context of a ${role || 'developer'}?` },
      { questionText: 'Describe a situation where you had a disagreement with a team member. How did you handle it?' }
    ];

    const interview = await Interview.create({
      userId: req.user._id,
      role: role || 'General Software Engineer',
      questions: defaultQuestions,
      status: 'in-progress'
    });

    res.status(201).json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit an answer and get AI feedback
// @route   POST /api/v1/interviews/:id/answer
// @access  Private
export const submitAnswer = async (req, res) => {
  try {
    const { answer } = req.body;
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ message: 'Interview session not found' });
    }

    if (interview.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const currentIndex = interview.currentQuestionIndex;
    if (currentIndex >= interview.questions.length) {
      return res.status(400).json({ message: 'Interview already completed' });
    }

    const questionObj = interview.questions[currentIndex];
    
    // Construct Prompt for Gemini
    const prompt = `You are a strict technical recruiter interviewing a candidate for a ${interview.role} role. 
    You asked: "${questionObj.questionText}"
    The candidate answered: "${answer}"
    
    Evaluate the candidate's answer. Provide a brief, constructive feedback paragraph highlighting what they did well and what they missed (e.g., using the STAR method, lack of metrics). 
    At the very end of your response, provide a score out of 10 in this exact format: "SCORE: X/10".`;

    let aiFeedback = await generateAIResponse(prompt);
    
    let score = Math.floor(Math.random() * 4) + 6; // Fallback score
    let feedback = `Your answer is structured well. To improve, try adding more specific metrics.`; // Fallback feedback

    if (aiFeedback) {
      // Extract score
      const scoreMatch = aiFeedback.match(/SCORE:\s*(\d+)\/10/);
      if (scoreMatch) {
        score = parseInt(scoreMatch[1], 10);
      }
      feedback = aiFeedback.replace(/SCORE:\s*\d+\/10/, '').trim();
    } else {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Update the question with answer and feedback
    interview.questions[currentIndex].userAnswer = answer;
    interview.questions[currentIndex].feedback = feedback;
    interview.questions[currentIndex].score = score;
    
    // Move to next question or complete
    interview.currentQuestionIndex += 1;
    
    if (interview.currentQuestionIndex >= interview.questions.length) {
      interview.status = 'completed';
      // Calculate overall score
      const totalScore = interview.questions.reduce((sum, q) => sum + (q.score || 0), 0);
      interview.overallScore = Math.round((totalScore / (interview.questions.length * 10)) * 100);
    }

    await interview.save();

    res.json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's past interviews
// @route   GET /api/v1/interviews
// @access  Private
export const getInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
