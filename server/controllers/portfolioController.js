import { generateAIResponse } from '../utils/aiHandler.js';
import Resume from '../models/Resume.js';
import User from '../models/User.js';

// @desc    Generate a single-page HTML portfolio from Resume
// @route   POST /api/v1/portfolio/generate
// @access  Private
export const generatePortfolio = async (req, res) => {
  try {
    const { resumeId, theme } = req.body;

    if (!resumeId) {
      return res.status(400).json({ message: 'Please select a resume to generate your portfolio.' });
    }

    const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    const user = await User.findById(req.user._id);

    // Provide context to AI
    const prompt = `You are an expert Frontend Developer and Web Designer. 
    I will provide you with a user's resume content. Your task is to generate a fully responsive, beautiful, single-page Portfolio Website in raw HTML format.

    REQUIREMENTS:
    1. Use Tailwind CSS via CDN: <script src="https://cdn.tailwindcss.com"></script>
    2. Theme Requested: ${theme || 'Modern Dark'}
    3. Include standard sections: Hero (Name, Headline, CTA), About Me, Experience, Education, and Skills.
    4. Use Lucide icons via CDN if possible or standard SVGs for icons.
    5. The design MUST be stunning, modern, and highly professional. Use subtle animations if possible.
    6. Ensure all information is extracted from the provided resume text. Do NOT use fake placeholder data if the real data is present.
    7. Generate ONLY the raw HTML code (starting with <!DOCTYPE html> and ending with </html>). Do NOT wrap it in markdown code blocks like \`\`\`html. 

    RESUME TEXT TO CONVERT:
    ${resume.extractedText || resume.content || 'Name: ' + user.fullName + ' (No specific resume text found. Generate a generic beautiful template for a Software Engineer).'}
    `;

    const aiResponse = await generateAIResponse(prompt);

    if (aiResponse) {
      // Clean up markdown wrapping if AI accidentally included it
      let htmlContent = aiResponse.trim();
      if (htmlContent.startsWith('\`\`\`html')) {
        htmlContent = htmlContent.replace(/^\`\`\`html\n/i, '');
      }
      if (htmlContent.startsWith('\`\`\`')) {
         htmlContent = htmlContent.replace(/^\`\`\`\n/i, '');
      }
      if (htmlContent.endsWith('\`\`\`')) {
        htmlContent = htmlContent.slice(0, -3).trim();
      }

      return res.json({ html: htmlContent });
    }

    // Mock Fallback Portfolio if AI fails
    const mockHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${user.fullName} - Portfolio</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap');
              body { font-family: 'Inter', sans-serif; scroll-behavior: smooth; }
              .glass { background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); }
          </style>
      </head>
      <body class="${theme === 'Modern Dark' ? 'bg-slate-900 text-slate-100' : theme === 'Clean Minimalist' ? 'bg-slate-50 text-slate-900' : 'bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white'} antialiased selection:bg-blue-500 selection:text-white">
          
          <!-- Navigation -->
          <nav class="fixed w-full z-50 glass border-b ${theme === 'Modern Dark' ? 'border-slate-800' : 'border-slate-200'}">
              <div class="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                  <div class="text-xl font-extrabold tracking-tighter">${user.fullName.split(' ')[0]}<span class="text-blue-500">.dev</span></div>
                  <div class="hidden md:flex gap-8 text-sm font-semibold text-slate-400">
                      <a href="#about" class="hover:text-white transition">About</a>
                      <a href="#experience" class="hover:text-white transition">Experience</a>
                      <a href="#skills" class="hover:text-white transition">Skills</a>
                  </div>
                  <a href="#contact" class="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-full transition shadow-lg shadow-blue-500/30">Hire Me</a>
              </div>
          </nav>

          <!-- Hero Section -->
          <header class="pt-40 pb-20 px-6 min-h-[80vh] flex flex-col justify-center items-center text-center">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
                  <span class="relative flex h-2 w-2"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span class="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span></span>
                  Available for work
              </div>
              <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight max-w-4xl">
                  Hi, I'm ${user.fullName}. <br/> I build <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">digital experiences</span>.
              </h1>
              <p class="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed">
                  I'm a passionate software engineer specializing in building exceptional websites, applications, and everything in between.
              </p>
              <div class="flex gap-4">
                  <a href="#experience" class="px-8 py-4 bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-full transition transform hover:-translate-y-1">View My Work</a>
                  <a href="#contact" class="px-8 py-4 glass hover:bg-white/10 font-bold rounded-full transition transform hover:-translate-y-1">Contact Me</a>
              </div>
          </header>

          <!-- Skills Section -->
          <section id="skills" class="py-20 px-6 ${theme === 'Modern Dark' ? 'bg-slate-800/50' : 'bg-slate-100/50'}">
              <div class="max-w-6xl mx-auto">
                  <h2 class="text-3xl font-extrabold mb-12 text-center">Core Technologies</h2>
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <!-- Skill Cards -->
                      <div class="glass p-6 rounded-2xl text-center hover:-translate-y-2 transition duration-300">
                          <h3 class="font-bold text-lg text-blue-400 mb-2">Frontend</h3>
                          <p class="text-sm text-slate-400">React, Vue, Tailwind CSS, HTML/CSS</p>
                      </div>
                      <div class="glass p-6 rounded-2xl text-center hover:-translate-y-2 transition duration-300">
                          <h3 class="font-bold text-lg text-emerald-400 mb-2">Backend</h3>
                          <p class="text-sm text-slate-400">Node.js, Express, Python, Django</p>
                      </div>
                      <div class="glass p-6 rounded-2xl text-center hover:-translate-y-2 transition duration-300">
                          <h3 class="font-bold text-lg text-amber-400 mb-2">Database</h3>
                          <p class="text-sm text-slate-400">MongoDB, PostgreSQL, Redis</p>
                      </div>
                      <div class="glass p-6 rounded-2xl text-center hover:-translate-y-2 transition duration-300">
                          <h3 class="font-bold text-lg text-purple-400 mb-2">DevOps</h3>
                          <p class="text-sm text-slate-400">AWS, Docker, CI/CD, Git</p>
                      </div>
                  </div>
              </div>
          </section>

          <!-- Footer -->
          <footer id="contact" class="py-12 px-6 border-t ${theme === 'Modern Dark' ? 'border-slate-800' : 'border-slate-200'} text-center">
              <h2 class="text-3xl font-extrabold mb-6">Let's work together.</h2>
              <a href="mailto:${user.email}" class="text-2xl text-blue-400 hover:text-blue-300 font-bold inline-block mb-12 border-b-2 border-blue-400/30 hover:border-blue-300 pb-1 transition">${user.email}</a>
              <p class="text-slate-500 text-sm">© 2026 ${user.fullName}. Built with AI Portfolio Generator.</p>
          </footer>
      </body>
      </html>
    `;

    return res.json({ html: mockHtml });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
