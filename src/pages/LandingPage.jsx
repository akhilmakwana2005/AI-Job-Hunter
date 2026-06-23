import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Target, Zap, MessageSquare, CheckCircle, Crown, Check, Moon, Sun } from 'lucide-react';

const LandingPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode for landing page

  useEffect(() => {
    // Check initial theme
    const theme = localStorage.getItem('theme');
    if (theme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-200 overflow-x-hidden font-sans transition-colors duration-300">
      {/* Navbar */}
      <nav className="fixed w-full top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
          <div className="flex items-center">
          <img src="/logo.png" alt="AI Job Hunter" className="w-8 h-8 mr-2 object-contain" />
          <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">Job Hunter</span>
        </div>
          <div className="hidden md:flex gap-10">
            <a href="#features" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors">Pricing</a>
          </div>
          <div className="flex gap-4 items-center">
            <button 
              className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
              onClick={toggleDarkMode}
              title="Toggle theme"
            >
              {isDarkMode ? <Sun size={20} className="text-amber-500" /> : <Moon size={20} />}
            </button>
            <Link to="/login" className="hidden sm:inline-flex text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition-colors">Log in</Link>
            <Link to="/register" className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-extrabold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[90vh] flex items-center">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[80vw] bg-[radial-gradient(circle,rgba(37,99,235,0.08)_0%,rgba(255,255,255,0)_60%)] dark:bg-[radial-gradient(circle,rgba(37,99,235,0.15)_0%,rgba(15,23,42,0)_60%)] pointer-events-none -z-10"></div>
        <div className="absolute top-1/4 right-0 w-[40vw] h-[40vw] bg-[radial-gradient(circle,rgba(6,182,212,0.05)_0%,rgba(255,255,255,0)_60%)] dark:bg-[radial-gradient(circle,rgba(6,182,212,0.1)_0%,rgba(15,23,42,0)_60%)] pointer-events-none -z-10"></div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 rounded-full text-sm font-bold mb-8 border border-blue-200 dark:border-blue-500/20 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
            ✨ The #1 AI Platform for Job Seekers
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight mb-8 text-slate-900 dark:text-white animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            Land your dream job <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">10x faster with AI.</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            Stop applying into the void. Auto-tailor your resume, practice voice mock interviews, and instantly generate perfect cover letters to beat the ATS every single time.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-24 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
            <Link to="/register" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-lg font-extrabold rounded-2xl text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 transition-all shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-1 duration-200 group">
              Start Free Trial <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
            <span className="text-sm text-slate-500 font-medium">No credit card required. Cancel anytime.</span>
          </div>
          
          {/* Premium Abstract Mockup */}
          <div className="relative max-w-5xl mx-auto perspective-1000 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
            {/* Fade out bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-slate-950 via-transparent to-transparent z-20 h-full w-full top-1/3"></div>
            
            <div className="bg-white dark:bg-[#0B1120] rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-[0_0_80px_rgba(37,99,235,0.1)] dark:shadow-[0_0_80px_rgba(37,99,235,0.25)] overflow-hidden transform rotate-x-12 hover:rotate-x-0 transition-transform duration-700 ease-out relative group">
              {/* Top Window Bar */}
              <div className="h-10 bg-slate-100 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 gap-2 relative z-10">
                <div className="w-3 h-3 rounded-full bg-red-400 dark:bg-red-500/90 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400 dark:bg-amber-500/90 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-400 dark:bg-emerald-500/90 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              </div>

              {/* Generated Premium Image */}
              <div className="w-full h-auto relative">
                <img 
                  src="/dashboard-mockup.png" 
                  alt="AI Job Hunter Dashboard Premium Layout" 
                  className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos Section */}
      <section className="py-12 border-y border-slate-200 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/30 text-center relative z-30">
        <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mb-8">Trusted by candidates hired at</p>
        <div className="flex justify-center gap-12 md:gap-24 flex-wrap opacity-50 grayscale">
          <span className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-white">Stripe</span>
          <span className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-white">Linear</span>
          <span className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-white">Notion</span>
          <span className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-white">Airbnb</span>
          <span className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-white">Vercel</span>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-30">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-slate-900 dark:text-white">Everything you need to get hired</h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">We replaced 5 different outdated tools with one cohesive, enterprise-grade AI agent.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl hover:border-blue-500/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 group">
            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <Target size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">ATS Resume Checker</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">Instantly score your resume against any job description. Get line-by-line optimization tips to bypass filters.</p>
          </div>
          <div className="p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl hover:border-blue-500/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 group">
            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <Zap size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Magic Tailor</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">Stop rewriting. Our AI perfectly rewrites your resume bullets to match the exact keywords of your target job.</p>
          </div>
          <div className="p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl hover:border-blue-500/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 group">
            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <MessageSquare size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Voice Mock Interviews</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">Practice with an AI interviewer over voice. Get instant feedback on your confidence, grammar, and technical answers.</p>
          </div>
        </div>
      </section>

      {/* Pricing / Upgrade Section */}
      <section id="pricing" className="py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800/50 relative z-30">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-slate-900 dark:text-white">Simple, transparent pricing</h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Invest in your career. Land a higher-paying job faster.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 md:p-10 shadow-xl flex flex-col transition-colors">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Basic</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">Perfect for getting started</p>
            <div className="mb-10">
              <span className="text-5xl font-extrabold text-slate-900 dark:text-white">Free</span>
            </div>
            <ul className="space-y-5 flex-1 mb-10">
              <li className="flex items-start gap-4 text-sm text-slate-700 dark:text-slate-300 font-medium">
                <Check size={20} className="text-slate-400 dark:text-slate-500 flex-shrink-0 mt-0.5" />
                <span>2 Resume ATS Scans / month</span>
              </li>
              <li className="flex items-start gap-4 text-sm text-slate-700 dark:text-slate-300 font-medium">
                <Check size={20} className="text-slate-400 dark:text-slate-500 flex-shrink-0 mt-0.5" />
                <span>1 Standard Cover Letter / month</span>
              </li>
              <li className="flex items-start gap-4 text-sm text-slate-700 dark:text-slate-300 font-medium">
                <Check size={20} className="text-slate-400 dark:text-slate-500 flex-shrink-0 mt-0.5" />
                <span>1 Text-based Mock Interview</span>
              </li>
              <li className="flex items-start gap-4 text-sm text-slate-700 dark:text-slate-300 font-medium">
                <Check size={20} className="text-slate-400 dark:text-slate-500 flex-shrink-0 mt-0.5" />
                <span>Standard Job Kanban Board</span>
              </li>
            </ul>
            <Link to="/register" className="w-full inline-flex justify-center py-4 px-6 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 font-bold rounded-2xl transition-colors">
              Get Started for Free
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="bg-gradient-to-b from-blue-50 to-white dark:from-blue-900 dark:to-slate-900 border border-blue-200 dark:border-blue-700/50 rounded-3xl p-8 md:p-10 shadow-2xl shadow-blue-500/10 dark:shadow-blue-900/20 flex flex-col relative transform md:-translate-y-4 hover:shadow-blue-500/20 dark:hover:shadow-blue-900/40 transition-all">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <span className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-xs font-extrabold px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg shadow-blue-500/30 tracking-widest uppercase">
                <Crown size={14} /> Most Popular
              </span>
            </div>
            
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 mt-2">Pro Access</h3>
            <p className="text-blue-700 dark:text-blue-200/80 text-sm mb-8">For serious job seekers</p>
            <div className="mb-10 flex items-end gap-1">
              <span className="text-5xl font-extrabold text-slate-900 dark:text-white">₹499</span>
              <span className="text-blue-600 dark:text-blue-200/80 font-medium mb-1">/month</span>
            </div>
            <ul className="space-y-5 flex-1 mb-10">
              <li className="flex items-start gap-4 text-sm text-slate-700 dark:text-blue-50 font-medium">
                <CheckCircle size={20} className="text-blue-500 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
                <span><strong className="text-slate-900 dark:text-white">Unlimited Auto-Tailoring:</strong> AI rewrites your resume perfectly for any job description.</span>
              </li>
              <li className="flex items-start gap-4 text-sm text-slate-700 dark:text-blue-50 font-medium">
                <CheckCircle size={20} className="text-blue-500 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
                <span><strong className="text-slate-900 dark:text-white">Unlimited Voice Interviews:</strong> Talk directly to our AI for realistic behavioral & technical prep.</span>
              </li>
              <li className="flex items-start gap-4 text-sm text-slate-700 dark:text-blue-50 font-medium">
                <CheckCircle size={20} className="text-blue-500 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
                <span><strong className="text-slate-900 dark:text-white">Infinite Cover Letters:</strong> Select tone (creative/formal) and generate instantly.</span>
              </li>
              <li className="flex items-start gap-4 text-sm text-slate-700 dark:text-blue-50 font-medium">
                <CheckCircle size={20} className="text-blue-500 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
                <span><strong className="text-slate-900 dark:text-white">LinkedIn Optimizer:</strong> Get a custom profile audit, headline, and about section.</span>
              </li>
              <li className="flex items-start gap-4 text-sm text-slate-700 dark:text-blue-50 font-medium">
                <CheckCircle size={20} className="text-blue-500 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
                <span><strong className="text-slate-900 dark:text-white">AI Portfolio Builder:</strong> 1-Click convert your resume into a hosted HTML website.</span>
              </li>
              <li className="flex items-start gap-4 text-sm text-slate-700 dark:text-blue-50 font-medium">
                <CheckCircle size={20} className="text-blue-500 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
                <span><strong className="text-slate-900 dark:text-white">Salary Negotiation:</strong> Get data-backed counter-offer scripts generated by AI.</span>
              </li>
            </ul>
            <Link to="/register" className="w-full inline-flex items-center justify-center py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-500 dark:to-blue-600 hover:from-blue-500 hover:to-blue-400 text-white font-extrabold rounded-2xl transition-all shadow-xl shadow-blue-500/25 gap-2 hover:-translate-y-1">
              <Zap size={20} className="fill-white" /> Upgrade Now
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-slate-50 dark:bg-slate-950 py-16 px-4 border-t border-slate-200 dark:border-slate-800/60 relative z-30 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between gap-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-4">
              <img src="/logo.png" alt="AI Job Hunter" className="w-6 h-6 mr-2 object-contain" />
              <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">Job Hunter</span>
            </div>
            <p className="text-slate-500 text-sm font-medium">Design-first AI tools for the modern job seeker.</p>
          </div>
          <div className="flex gap-16">
            <div>
              <h4 className="font-bold mb-4 text-slate-900 dark:text-white">Product</h4>
              <ul className="space-y-3 text-sm text-slate-500 font-medium">
                <li><a href="#features" className="hover:text-blue-400 transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-blue-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Changelog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-slate-900 dark:text-white">Legal</h4>
              <ul className="space-y-3 text-sm text-slate-500 font-medium">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
