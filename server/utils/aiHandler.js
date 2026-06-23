import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy-key');

// In-Memory Queue for AI Requests to prevent 429 Too Many Requests
const requestQueue = [];
let isProcessingQueue = false;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const processQueue = async () => {
  if (isProcessingQueue || requestQueue.length === 0) return;
  isProcessingQueue = true;

  while (requestQueue.length > 0) {
    const { prompt, resolve } = requestQueue.shift();
    
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      resolve(response.text());
    } catch (error) {
      console.error('AI Generation Error in Queue:', error);
      resolve(null); // Return null to trigger fallback logic gracefully
    }

    // Wait 4 seconds between requests to respect free-tier rate limits (15 RPM)
    if (requestQueue.length > 0) {
      await delay(4000); 
    }
  }

  isProcessingQueue = false;
};

export const generateAIResponse = (prompt) => {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'dummy-key') {
    console.warn('WARNING: GEMINI_API_KEY is not set. Using fallback mock response.');
    return Promise.resolve(null); // Will trigger fallback logic in controllers
  }

  return new Promise((resolve) => {
    requestQueue.push({ prompt, resolve });
    processQueue();
  });
};
