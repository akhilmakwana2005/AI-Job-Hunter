import NetworkingMessage from '../models/NetworkingMessage.js';
import User from '../models/User.js';
import { generateAIResponse } from '../utils/aiHandler.js';

// @desc    Generate Networking Message
// @route   POST /api/v1/networking/generate
// @access  Private
export const generateMessage = async (req, res) => {
  try {
    const { recipientName, recipientRole, company, messageType } = req.body;
    
    const user = await User.findById(req.user._id);

    let lengthInstruction = "Keep it concise.";
    if (messageType === 'LinkedIn Connection') {
      lengthInstruction = "Keep it under 300 characters strictly.";
    } else if (messageType === 'Cold Email') {
      lengthInstruction = "Make it 2-3 short paragraphs, highly engaging and professional.";
    } else if (messageType === 'Follow-up Email') {
      lengthInstruction = "Keep it brief, reiterating interest and thanking them for their time.";
    }

    const prompt = `Write a ${messageType} for the applicant named ${user.fullName}.
    The message is directed to ${recipientName}, who is a ${recipientRole} at ${company}.
    The applicant's experience level is ${user.profile?.experienceLevel || 'professional'}.
    ${lengthInstruction}
    Do not include placeholders, start directly with the greeting.`;

    let generatedContent = await generateAIResponse(prompt);

    if (!generatedContent) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      generatedContent = `Hi ${recipientName},\n\nI hope this message finds you well. I noticed your work as ${recipientRole} at ${company} and wanted to reach out. I am an experienced professional looking to connect with industry leaders. Let's connect!\n\nBest,\n${user.fullName}`;
    }

    const newMessage = await NetworkingMessage.create({
      userId: req.user._id,
      recipientName,
      recipientRole,
      company,
      messageType,
      generatedContent
    });

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's past networking messages
// @route   GET /api/v1/networking
// @access  Private
export const getMessages = async (req, res) => {
  try {
    const messages = await NetworkingMessage.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
