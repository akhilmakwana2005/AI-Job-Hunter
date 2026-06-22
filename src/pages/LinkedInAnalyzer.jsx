import { useState, useEffect } from 'react';
import { UserCircle, Search, Target, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { linkedinService } from '../services/api';

const LinkedInAnalyzer = () => {
  const [profileText, setProfileText] = useState('');
  const [profileName, setProfileName] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await linkedinService.getAnalyses();
      setHistory(data);
      if (data.length > 0) {
        setResults(data[0]); // Load latest by default
      }
    } catch (error) {
      console.error('Failed to fetch LinkedIn history', error);
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!profileText || profileText.length < 50) {
      alert('Please paste more text from your profile for accurate analysis (at least 50 characters).');
      return;
    }

    setIsAnalyzing(true);
    try {
      const data = await linkedinService.analyzeProfile({ profileText, profileName: profileName || 'My Profile' });
      setResults(data);
      setHistory([data, ...history]);
      setProfileText('');
    } catch (error) {
      console.error('Failed to analyze LinkedIn profile', error);
      alert(error.response?.data?.message || 'Failed to analyze profile');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full">
      {/* Left side: Form & History */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
            <UserCircle size={20} className="text-[#0A66C2]" />
            <h2 className="text-lg font-bold text-slate-900">LinkedIn Analyzer</h2>
          </div>

          <form onSubmit={handleAnalyze} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Profile Name (Optional)</label>
              <input
                type="text"
                placeholder="e.g. John Doe - Frontend"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:border-[#0A66C2]"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Paste Profile Text</label>
              <textarea
                required
                rows={6}
                placeholder="Copy and paste your LinkedIn Headline, About section, and Experience here..."
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:border-[#0A66C2] resize-none"
                value={profileText}
                onChange={(e) => setProfileText(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={isAnalyzing || !profileText}
              className="w-full flex justify-center items-center gap-2 bg-[#0A66C2] text-white rounded-md py-2.5 text-sm font-medium hover:bg-[#004182] transition-colors shadow-sm disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Analyzing Profile...
                </>
              ) : (
                <>
                  <Search size={16} />
                  Analyze Now
                </>
              )}
            </button>
          </form>
        </div>

        {history.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex-1">
            <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Recent Analyses</h3>
            <div className="space-y-3">
              {history.map((item, idx) => (
                <div 
                  key={item._id || idx} 
                  onClick={() => setResults(item)}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${results?._id === item._id ? 'border-[#0A66C2] bg-blue-50' : 'border-slate-200 hover:border-blue-200'}`}
                >
                  <p className="text-sm font-medium text-slate-900 truncate">{item.profileName || 'My Profile'}</p>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</p>
                    <span className={`text-xs font-bold ${item.score >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
                      Score: {item.score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right side: Results Dashboard */}
      <div className="w-full lg:w-2/3">
        {results ? (
          <div className="space-y-6">
            {/* Overall Score */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 flex flex-col md:flex-row items-center gap-8 bg-gradient-to-br from-[#0A66C2]/5 to-white dark:from-[#0A66C2]/10 dark:to-slate-800">
              <div className="relative w-32 h-32 flex-shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path className="text-slate-200" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                  <path className="text-blue-500 transition-all duration-1000 ease-out" strokeDasharray={`${results.score}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-slate-800 rounded-full m-2 shadow-sm">
                  <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">{results.score}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Profile Score</span>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Profile Analysis Complete</h2>
                <p className="text-slate-600">
                  {results.score >= 80 
                    ? "Great job! Your profile is highly optimized for recruiters and search visibility." 
                    : "Your profile has good bones, but needs some optimization to stand out to recruiters."}
                </p>
              </div>
            </div>

            {/* Detailed Section Breakdown */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Headline */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-900">Headline</h3>
                  <span className="px-2 py-1 rounded text-xs font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                    {results.analysis.headline.score}/100
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-4">{results.analysis.headline.feedback}</p>
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-500 uppercase">Suggestions</p>
                  {results.analysis.headline.suggestions.map((sug, i) => (
                    <div key={i} className="flex gap-2 items-start text-sm text-slate-700 bg-slate-50 p-2 rounded">
                      <CheckCircle size={16} className="text-[#0A66C2] flex-shrink-0 mt-0.5" /> {sug}
                    </div>
                  ))}
                </div>
              </div>

              {/* About Section */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-900">About Section</h3>
                  <span className="px-2 py-1 rounded text-xs font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                    {results.analysis.about.score}/100
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-4">{results.analysis.about.feedback}</p>
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-500 uppercase">Suggestions</p>
                  {results.analysis.about.suggestions.map((sug, i) => (
                    <div key={i} className="flex gap-2 items-start text-sm text-slate-700 bg-slate-50 p-2 rounded">
                      <CheckCircle size={16} className="text-[#0A66C2] flex-shrink-0 mt-0.5" /> {sug}
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-900">Experience Section</h3>
                  <span className="px-2 py-1 rounded text-xs font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                    {results.analysis.experience.score}/100
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-4">{results.analysis.experience.feedback}</p>
                <div className="grid md:grid-cols-2 gap-2">
                  {results.analysis.experience.suggestions.map((sug, i) => (
                    <div key={i} className="flex gap-2 items-start text-sm text-slate-700 bg-slate-50 p-2 rounded border border-slate-100">
                      <CheckCircle size={16} className="text-[#0A66C2] flex-shrink-0 mt-0.5" /> {sug}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Overall Recommendations */}
            <div className="bg-[#0A66C2] rounded-xl shadow-sm border border-[#0A66C2] p-6 text-white">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <AlertCircle size={20} /> Overall Recommendations
              </h3>
              <ul className="space-y-3">
                {results.analysis.overallFeedback.map((fb, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-blue-100">
                    <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">{i+1}</span>
                    {fb}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center p-12 h-full min-h-[500px]">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
              <UserCircle size={32} className="text-[#0A66C2]" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Optimize Your LinkedIn</h2>
            <p className="text-slate-500 max-w-md mx-auto leading-relaxed mb-6">
              Paste your LinkedIn profile text (Headline, About, Experience) to get instant, AI-driven feedback to attract top recruiters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LinkedInAnalyzer;
