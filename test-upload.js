import fs from 'fs';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';

async function test() {
  try {
    // 1. Create a dummy test user and login to get token
    const api = axios.create({ baseURL: 'http://localhost:5000/api/v1' });
    
    let token = null;
    
    // Try to login with a test user or register one
    try {
      const loginRes = await api.post('/auth/login', { email: 'test@example.com', password: 'password123' });
      token = loginRes.data.token;
      console.log('Login successful, got token');
    } catch (e) {
      console.log('Login failed, registering...');
      const regRes = await api.post('/auth/register', { name: 'Test', email: 'test@example.com', password: 'password123' });
      token = regRes.data.token;
      console.log('Register successful, got token');
    }

    // 2. Create a dummy resume text file
    fs.writeFileSync('dummy_resume.pdf', 'This is a test resume with experience and education and skills.');
    
    // 3. Upload the resume using FormData
    const formData = new FormData();
    formData.append('resumeFile', fs.createReadStream('dummy_resume.pdf'));
    formData.append('fileName', 'dummy_resume.pdf');
    formData.append('targetRole', 'Software Engineer');

    console.log('Sending request to /resumes/analyze...');
    const response = await api.post('/resumes/analyze', formData, {
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer ${token}`
      }
    });

    console.log('Success!', response.data);

  } catch (error) {
    console.error('Error occurred:');
    if (error.response) {
      console.error(error.response.status, error.response.data);
    } else {
      console.error(error.message);
    }
  } finally {
    if (fs.existsSync('dummy_resume.pdf')) {
      fs.unlinkSync('dummy_resume.pdf');
    }
  }
}

test();
