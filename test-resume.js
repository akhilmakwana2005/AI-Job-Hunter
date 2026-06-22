import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const API_URL = 'http://localhost:5000/api/v1';
const api = axios.create({ baseURL: API_URL });

async function main() {
  try {
    const email = `test_${Date.now()}@example.com`;
    const password = 'Test123!';
    let token;
    // Register user (if already exists, login)
    try {
      const regRes = await api.post('/auth/register', { name: 'Test User', fullName: 'Test User', email, password });
      token = regRes.data.token;
      console.log('Registered new user');
    } catch (e) {
      if (e.response && e.response.status === 400) {
        const loginRes = await api.post('/auth/login', { email, password });
        token = loginRes.data.token;
        console.log('Logged in existing user');
      } else {
        throw e;
      }
    }

    // Create dummy resume PDF (plain text content)
    const dummyPath = path.resolve('dummy_resume.pdf');
    const dummyContent = `John Doe\nExperience: 3 years software development at XYZ Corp.\nEducation: B.Sc Computer Science, University ABC.\nSkills: JavaScript, React, Node.js, MongoDB.`;
    fs.writeFileSync(dummyPath, dummyContent);
    console.log('Created dummy resume');

    const form = new FormData();
    form.append('resumeFile', fs.createReadStream(dummyPath));
    form.append('fileName', 'dummy_resume.pdf');
    form.append('targetRole', 'Software Engineer');

    const response = await api.post('/resumes/analyze', form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Response:', response.data);
  } catch (err) {
    console.error('Test error:', err.response ? err.response.data : err.message);
  }
}

main();
