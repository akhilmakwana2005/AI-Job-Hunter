import { generateAIResponse } from './utils/aiHandler.js';

async function testLinkedIn() {
  const profileText = `
    John Doe - Frontend Developer
    About: I am a passionate developer with 5 years of experience in React and Node.js.
    Experience: 
    Software Engineer at TechCorp (2020-Present)
    - Built the frontend of the main web application using React.
    - Improved performance by 20%.
  `;

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

  console.log('Generating AI Response...');
  const aiResponse = await generateAIResponse(prompt);
  console.log('AI Response:', aiResponse);

  try {
    const parsed = JSON.parse(aiResponse.trim().replace(/```json/g, '').replace(/```/g, ''));
    console.log('Parse SUCCESS:', parsed);
  } catch (e) {
    console.error('Parse ERROR:', e.message);
  }
}

testLinkedIn();
