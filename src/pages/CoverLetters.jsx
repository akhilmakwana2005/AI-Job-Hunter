import { useState, useEffect } from 'react';
import { PenTool, Copy, Check, Sparkles, Building, Briefcase } from 'lucide-react';
import { coverLetterService } from '../services/api';

const CoverLetters = () => {
  const [formData, setFormData] = useState({ targetCompany: '', targetRole: '', jobDescription: '' });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState(null);
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await coverLetterService.getCoverLetters();
      setHistory(data);
      if (data.length > 0) {
        setGeneratedLetter(data[0]);
      }
    } catch (error) {
      console.error('Failed to fetch cover letter history', error);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!formData.targetCompany || !formData.targetRole) return;

    setIsGenerating(true);
    setCopied(false);
    try {
      const data = await coverLetterService.generateCoverLetter(formData);
      setGeneratedLetter(data);
      setHistory([data, ...history]);
      setFormData({ targetCompany: '', targetRole: '', jobDescription: '' });
    } catch (error) {
      console.error('Failed to generate cover letter', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedLetter) {
      navigator.clipboard.writeText(generatedLetter.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col xl:flex-row gap-8 h-full">
      {/* Left side: Input Form */}
      <div className="w-full xl:w-1/3 flex flex-col gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
            <Sparkles size={20} className="text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">AI Generator</h2>
          </div>

          <form onSubmit={handleGenerate} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  required
                  type="text"
                  placeholder="e.g. Stripe"
                  className="pl-9 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.targetCompany}
                  onChange={(e) => setFormData({ ...formData, targetCompany: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Target Role</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  required
                  type="text"
                  placeholder="e.g. Senior Frontend Engineer"
                  className="pl-9 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.targetRole}
                  onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Job Description (Optional)</label>
              <textarea
                placeholder="Paste the job description here for a highly personalized letter..."
                rows={5}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                value={formData.jobDescription}
                onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
              />
              <p className="text-xs text-slate-500 mt-1">Providing the JD increases match rate by 40%.</p>
            </div>

            <button
              type="submit"
              disabled={isGenerating || !formData.targetCompany || !formData.targetRole}
              className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white rounded-md py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Generating...
                </>
              ) : (
                <>
                  <PenTool size={16} />
                  Generate Cover Letter
                </>
              )}
            </button>
          </form>
        </div>

        {/* History Widget */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex-1">
          <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Past Letters</h3>
          <div className="space-y-3">
            {history.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">No past letters found.</p>
            ) : (
              history.map((item, idx) => (
                <div 
                  key={item._id || idx} 
                  onClick={() => { setGeneratedLetter(item); setCopied(false); }}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${generatedLetter?._id === item._id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500'}`}
                >
                  <p className="text-sm font-bold text-slate-900 truncate">{item.targetCompany}</p>
                  <p className="text-xs font-medium text-slate-600 truncate mb-1">{item.targetRole}</p>
                  <p className="text-xs text-slate-400">{new Date(item.createdAt).toLocaleDateString()}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Right side: Editor/Preview */}
      <div className="w-full xl:w-2/3 h-full flex flex-col">
        {generatedLetter ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Cover Letter for {generatedLetter.targetCompany}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{generatedLetter.targetRole}</p>
              </div>
              <button 
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors shadow-sm"
              >
                {copied ? <Check size={16} className="text-emerald-500 dark:text-emerald-400" /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy to Clipboard'}
              </button>
            </div>
            
            <div className="p-8 flex-1 overflow-y-auto scrollbar-hide bg-slate-50/30 dark:bg-slate-900/50">
              <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 p-10 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 min-h-[600px]">
                <div className="prose prose-sm sm:prose lg:prose-lg text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                  {generatedLetter.content}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center p-12 h-full min-h-[500px]">
            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
              <PenTool size={32} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">AI Cover Letter Generator</h2>
            <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
              Enter the company name, target role, and paste the job description. Our AI will craft a highly personalized and compelling cover letter in seconds.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoverLetters;
