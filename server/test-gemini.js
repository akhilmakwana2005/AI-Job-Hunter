import { GoogleGenerativeAI } from '@google/generative-ai';

async function test() {
  const key = 'AIzaSySOME_COMPLETELY_RANDOM_FAKE_KEY_123';
  const genAI = new GoogleGenerativeAI(key);
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent('Say hello world');
    const response = await result.response;
    console.log('SUCCESS! Response:', response.text());
  } catch (error) {
    console.error('FAILED!', error.message);
  }
}

test();
