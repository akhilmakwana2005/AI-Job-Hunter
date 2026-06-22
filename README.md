# 🚀 AI Job Hunter Agent (SaaS Platform)

The ultimate AI-powered career assistant designed to help professionals optimize their job search, prepare for interviews, and land their dream jobs faster. Built with the MERN stack and powered by Google Gemini AI.

## 🌟 Features

* **Intelligent Dashboard:** Track your career progress with beautiful metrics and AI recommendations.
* **Smart Job Search:** Find the best jobs filtered by your experience, with an AI Match Score calculating your fit out of 100%.
* **Resume Analyzer & ATS Scorer:** Upload your resume to get instant keyword analysis, ATS scores, and actionable feedback.
* **AI Cover Letter Generator:** Input a job description and company name to instantly generate highly personalized, persuasive cover letters.
* **Voice Mock Interviewer:** Practice technical and behavioral interviews with an interactive AI chat interface that grades your answers using the STAR method.
* **Kanban Applications Tracker:** Visually track all your job applications (Saved, Applied, Interviewing, Offered, Rejected) with an intuitive Drag & Drop board.
* **LinkedIn Profile Optimizer:** Paste your LinkedIn URL to receive a breakdown of your Headline, About, and Experience sections to attract top recruiters.
* **Skill Gap Analysis:** Compare your current skills against market demands for your target role.

## 🛠️ Tech Stack

**Frontend:**
* React.js (Vite)
* Tailwind CSS v4
* React Router v6
* Redux Toolkit
* Axios
* Lucide React (Icons)

**Backend:**
* Node.js & Express.js
* MongoDB & Mongoose
* JSON Web Tokens (JWT) for Authentication
* Google Generative AI (Gemini 1.5 Flash) SDK

## ⚙️ Getting Started

### Prerequisites
* Node.js (v18+ recommended)
* MongoDB (Local or Atlas)
* Google Gemini API Key

### Installation

1. **Clone the repository** (if applicable):
   \`\`\`bash
   git clone <repository-url>
   cd "AI Job Hunter Agent"
   \`\`\`

2. **Install Frontend Dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

3. **Install Backend Dependencies:**
   \`\`\`bash
   cd server
   npm install
   \`\`\`

### Environment Variables

Create a \`.env\` file in the \`server\` directory:

\`\`\`env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-job-hunter
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key_here
\`\`\`

### Running Locally

1. **Start the Backend Server:**
   \`\`\`bash
   cd server
   npm run dev
   \`\`\`

2. **Start the Frontend Development Server:**
   Open a new terminal and run:
   \`\`\`bash
   npm run dev
   \`\`\`

The application will be accessible at \`http://localhost:5173\`.

## 📁 Project Structure

\`\`\`
AI Job Hunter Agent/
├── server/                   # Backend Node/Express code
│   ├── controllers/          # API Route Logic (Auth, Jobs, AI)
│   ├── models/               # MongoDB Schemas
│   ├── routes/               # API Endpoints
│   ├── utils/                # AI Handlers & Helpers
│   └── server.js             # Main server entrypoint
├── src/                      # Frontend React code
│   ├── components/           # Reusable UI & Layout components
│   ├── pages/                # Main pages (Dashboard, Resume, etc.)
│   ├── services/             # API connection logic (Axios)
│   ├── store/                # Redux state management
│   ├── App.jsx               # Routing definition
│   └── index.css             # Tailwind configuration
├── vercel.json               # Frontend deployment config
└── package.json              # Project dependencies
\`\`\`

## 🚀 Deployment

* **Frontend:** Deployable to Vercel out of the box using the provided \`vercel.json\` config. Set the \`VITE_API_URL\` environment variable to your backend URL.
* **Backend:** Deployable to Render, Heroku, or any Node.js hosting. Ensure \`NODE_ENV=production\` is set along with MongoDB and Gemini credentials.

---
*Built with ❤️ for the modern job seeker.*
