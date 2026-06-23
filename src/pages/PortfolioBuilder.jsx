import { useState, useEffect } from 'react';
import { 
  Globe, 
  Layout, 
  Download, 
  Code, 
  Sparkles,
  FileText,
  Palette
} from 'lucide-react';
import { resumeService, portfolioService } from '../services/api';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const PortfolioBuilder = () => {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('Modern Dark');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedHtml, setGeneratedHtml] = useState(null);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const data = await resumeService.getResumes();
      setResumes(data);
      if (data.length > 0) setSelectedResume(data[0]._id);
    } catch (error) {
      console.error('Failed to fetch resumes', error);
    }
  };

  const handleGenerate = async () => {
    if (!selectedResume) {
      alert("Please select a resume first.");
      return;
    }

    if (!user?.isPro) {
      navigate('/dashboard/upgrade');
      return;
    }

    setIsGenerating(true);
    setGeneratedHtml(null);

    try {
      const result = await portfolioService.generatePortfolio({
        resumeId: selectedResume,
        theme: selectedTheme
      });
      setGeneratedHtml(result.html);
    } catch (error) {
      console.error('Failed to generate portfolio', error);
      alert(error.response?.data?.message || 'Generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedHtml) return;
    const blob = new Blob([generatedHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(user?.fullName || user?.name || 'User').replace(/\s+/g, '_')}_Portfolio.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const themes = [
    { id: 'Modern Dark', name: 'Modern Dark', bg: 'bg-slate-900', border: 'border-slate-700' },
    { id: 'Clean Minimalist', name: 'Clean Minimalist', bg: 'bg-white', border: 'border-slate-200' },
    { id: 'Creative Vibrant', name: 'Creative Vibrant', bg: 'bg-gradient-to-br from-purple-600 to-blue-600', border: 'border-transparent' }
  ];

  return (
    <div className="flex flex-col xl:flex-row gap-8 h-full pb-8">
      {/* Left side: Configuration */}
      <div className="w-full xl:w-1/3 flex flex-col gap-6 overflow-y-auto pr-2 pb-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 relative">
          
          {!user?.isPro && (
             <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider z-10 shadow-sm">
                Pro Feature
             </div>
          )}

          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
               <Globe size={20} />
            </div>
            <div>
               <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">AI Portfolio Builder</h2>
               <p className="text-xs text-slate-500 dark:text-slate-400">Convert your resume to a live website</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Resume Selection */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <FileText size={14} /> Source Resume
              </label>
              <select
                className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white appearance-none"
                value={selectedResume}
                onChange={(e) => setSelectedResume(e.target.value)}
                disabled={resumes.length === 0}
              >
                {resumes.length === 0 ? (
                  <option value="">No resumes found</option>
                ) : (
                  resumes.map(r => (
                    <option key={r._id} value={r._id}>{r.title || r.fileName || 'Untitled Resume'}</option>
                  ))
                )}
              </select>
            </div>

            {/* Theme Selection */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <Palette size={14} /> Select Design Theme
              </label>
              <div className="grid grid-cols-1 gap-3">
                {themes.map(theme => (
                  <div 
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme.id)}
                    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between group ${
                      selectedTheme === theme.id 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700'
                    }`}
                  >
                     <span className="text-sm font-bold text-slate-900 dark:text-white">{theme.name}</span>
                     <div className={`w-8 h-8 rounded-full shadow-inner ${theme.bg} ${theme.border} border`}></div>
                     {selectedTheme === theme.id && (
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                           {/* Add a checkmark maybe, but this design is clean enough */}
                        </div>
                     )}
                  </div>
                ))}
              </div>
            </div>

            {user?.isPro ? (
              <button
                onClick={handleGenerate}
                disabled={isGenerating || resumes.length === 0}
                className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl py-3.5 text-sm font-bold transition-all shadow-md shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Designing Website...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Generate Portfolio
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => navigate('/dashboard/upgrade')}
                className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white rounded-xl py-3.5 text-sm font-bold transition-all shadow-md shadow-amber-500/20 hover:-translate-y-0.5 animate-pulse"
              >
                <Crown size={18} />
                Upgrade to Pro to Generate
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Right side: Live Preview */}
      <div className="w-full xl:w-2/3 h-full min-h-[600px] flex flex-col bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        
        {/* Browser Toolbar Header */}
        <div className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
           <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-400"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
           </div>
           <div className="flex-1 max-w-sm mx-4 bg-white dark:bg-slate-800 rounded-md px-3 py-1.5 text-[10px] text-center text-slate-400 font-mono truncate border border-slate-200 dark:border-slate-700">
              {generatedHtml ? `https://${(user?.fullName || user?.name || 'User').replace(/\s+/g, '').toLowerCase()}.portfolio.ai` : 'about:blank'}
           </div>
           <div className="flex gap-2">
              {generatedHtml && (
                 <>
                    <button 
                       onClick={() => {
                          navigator.clipboard.writeText(generatedHtml);
                          alert('HTML code copied to clipboard!');
                       }}
                       className="p-1.5 text-slate-500 hover:text-blue-600 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors"
                       title="Copy Source Code"
                    >
                       <Code size={16} />
                    </button>
                    <button 
                       onClick={handleDownload}
                       className="p-1.5 text-slate-500 hover:text-emerald-600 bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded transition-colors"
                       title="Download HTML File"
                    >
                       <Download size={16} />
                    </button>
                 </>
              )}
           </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 bg-slate-50 dark:bg-slate-950 relative">
          {generatedHtml ? (
            <iframe 
               srcDoc={generatedHtml} 
               className="w-full h-full border-none"
               title="Portfolio Preview"
               sandbox="allow-scripts" // Safe since we generated it, but good practice
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
              <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 text-blue-300 dark:text-blue-800 rounded-full flex items-center justify-center mb-6">
                <Layout size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-400 dark:text-slate-600 mb-2">Live Preview Pending</h3>
              <p className="text-sm text-slate-400 dark:text-slate-600 max-w-sm mx-auto">
                 Select your resume and theme on the left, then click Generate to instantly build your personal portfolio website.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioBuilder;
