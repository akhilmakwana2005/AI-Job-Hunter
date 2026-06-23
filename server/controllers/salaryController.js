import { generateAIResponse } from '../utils/aiHandler.js';
import SalaryNegotiation from '../models/SalaryNegotiation.js'; // We will create this model

// @desc    Generate a salary negotiation email
// @route   POST /api/v1/salary/negotiate
// @access  Private
export const generateNegotiationEmail = async (req, res) => {
  try {
    const { 
      companyName, 
      jobTitle, 
      offeredSalary, 
      targetSalary, 
      benefits, 
      leveragePoints 
    } = req.body;

    if (!companyName || !jobTitle || !offeredSalary || !targetSalary) {
      return res.status(400).json({ message: 'Please provide company name, job title, offered salary, and target salary.' });
    }

    const prompt = `You are an expert Career Coach and Salary Negotiation Specialist.
    My client has received a job offer. Please write a highly professional, polite, and persuasive salary negotiation email to the recruiter/hiring manager.
    
    Details:
    - Company: ${companyName}
    - Role: ${jobTitle}
    - Offered Salary: ${offeredSalary}
    - Target Salary (Counter Offer): ${targetSalary}
    - Additional Benefits Mentioned: ${benefits || 'None specified'}
    - Key Leverage Points (Why they deserve more): ${leveragePoints || 'Excited about the role and confident in bringing value.'}
    
    The email must:
    1. Express gratitude and excitement for the offer.
    2. Professionally counter-offer with the Target Salary.
    3. Justify the counter-offer using the leverage points without sounding arrogant.
    4. Keep the door open for discussion (do not issue an ultimatum).
    
    Return EXACTLY a JSON object with this structure (no markdown formatting, no backticks):
    {
      "subject": "Email Subject Line",
      "emailBody": "The full email content here..."
    }`;

    const aiResponse = await generateAIResponse(prompt);

    if (aiResponse) {
      try {
        const parsed = JSON.parse(aiResponse.trim().replace(/```json/g, '').replace(/```/g, ''));
        
        // Save to DB
        const negotiationRecord = await SalaryNegotiation.create({
          userId: req.user._id,
          companyName,
          jobTitle,
          subject: parsed.subject,
          offeredSalary,
          targetSalary,
          emailContent: parsed.emailBody
        });

        return res.json({ 
          _id: negotiationRecord._id,
          subject: parsed.subject,
          emailContent: parsed.emailBody,
          companyName,
          jobTitle,
          offeredSalary,
          targetSalary,
          createdAt: negotiationRecord.createdAt
        });
      } catch (e) {
        console.error('Failed to parse Salary Negotiation JSON', e);
        return res.status(500).json({ message: 'AI returned invalid formatting. Please try again.' });
      }
    }

    return res.status(429).json({ message: 'AI Quota Exceeded (Too Many Requests). Please wait 1 minute and try again.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's past negotiation emails
// @route   GET /api/v1/salary
// @access  Private
export const getNegotiations = async (req, res) => {
  try {
    const negotiations = await SalaryNegotiation.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(negotiations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
