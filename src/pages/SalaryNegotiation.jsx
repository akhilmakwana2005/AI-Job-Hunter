import { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Copy, 
  Check, 
  Sparkles, 
  Building, 
  Briefcase, 
  TrendingUp, 
  Gift, 
  Award 
} from 'lucide-react';
import { salaryService } from '../services/api';

const SalaryNegotiation = () => {
  const [formData, setFormData] = useState({ 
    companyName: '', 
    jobTitle: '', 
    offeredSalary: '',
    targetSalary: '',
    benefits: '',
    leveragePoints: ''
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState(null);
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const fetchHistory = async () => {
    try {
      const data = await salaryService.getNegotiations();
      setHistory(data);
      if (data.length > 0) {
        setGeneratedEmail(data[0]);
      }
    } catch (error) {
      console.error('Failed to fetch negotiation history', error);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!formData.companyName || !formData.jobTitle || !formData.offeredSalary || !formData.targetSalary) return;

    setIsGenerating(true);
    setCopied(false);
    try {
      const data = await salaryService.generateNegotiationEmail(formData);
      setGeneratedEmail(data);
      setHistory([data, ...history]);
      setFormData({ 
        companyName: '', 
        jobTitle: '', 
        offeredSalary: '',
        targetSalary: '',
        benefits: '',
        leveragePoints: ''
      });
    } catch (error) {
      console.error('Failed to generate negotiation email', error);
      if (error.response?.status === 429) {
        setCooldown(60);
      } else {
        alert(error.response?.data?.message || 'Failed to generate email. Please try again.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedEmail) {
      navigator.clipboard.writeText(`Subject: ${generatedEmail.subject}\n\n${generatedEmail.emailContent}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col xl:flex-row gap-8 h-full">
      {/* Left side: Input Form */}
      <div className="w-full xl:w-1/3 flex flex-col gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
            <Sparkles size={20} className="text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Negotiation AI</h2>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1">Company</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    required
                    type="text"
                    placeholder="Company"
                    className="pl-9 w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1">Role</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Briefcase className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    required
                    type="text"
                    placeholder="Job Title"
                    className="pl-9 w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1">Offered</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    required
                    type="text"
                    placeholder="$100k"
                    className="pl-9 w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    value={formData.offeredSalary}
                    onChange={(e) => setFormData({ ...formData, offeredSalary: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1">Target</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <TrendingUp className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    required
                    type="text"
                    placeholder="$115k"
                    className="pl-9 w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    value={formData.targetSalary}
                    onChange={(e) => setFormData({ ...formData, targetSalary: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1 flex items-center gap-1">
                <Gift className="w-3 h-3" /> Other Benefits
              </label>
              <input
                type="text"
                placeholder="e.g. Sign-on bonus, equity, remote work"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                value={formData.benefits}
                onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1 flex items-center gap-1">
                <Award className="w-3 h-3" /> Key Leverage Points
              </label>
              <textarea
                placeholder="Why do you deserve more? (e.g. Competing offer, rare skills, senior experience)"
                rows={3}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                value={formData.leveragePoints}
                onChange={(e) => setFormData({ ...formData, leveragePoints: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={isGenerating || cooldown > 0 || !formData.companyName || !formData.jobTitle || !formData.offeredSalary || !formData.targetSalary}
              className={`w-full flex justify-center items-center gap-2 rounded-lg py-2.5 text-sm font-bold transition-all shadow-md ${
                cooldown > 0 
                  ? 'bg-amber-500 text-white cursor-not-allowed opacity-80'
                  : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white disabled:opacity-50'
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Crafting Email...
                </>
              ) : cooldown > 0 ? (
                <>
                  <Sparkles size={16} /> Wait {cooldown}s (AI Limit)
                </>
              ) : (
                <>
                  <DollarSign size={16} />
                  Generate Counter Offer
                </>
              )}
            </button>
          </form>
        </div>

        {/* History Widget */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex-1 overflow-y-auto">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">Past Negotiations</h3>
          <div className="space-y-3">
            {history.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">No past records found.</p>
            ) : (
              history.map((item, idx) => (
                <div 
                  key={item._id || idx} 
                  onClick={() => { setGeneratedEmail(item); setCopied(false); }}
                  className={`p-3 rounded-xl border cursor-pointer transition-colors ${
                    generatedEmail?._id === item._id 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' 
                      : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500/50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{item.companyName}</p>
                      <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400 truncate mb-1">{item.jobTitle}</p>
                    </div>
                    <div className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 px-2 py-0.5 rounded-full font-bold">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <span className="text-[10px] font-bold bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 px-1.5 py-0.5 rounded">Offered: {item.offeredSalary}</span>
                    <span className="text-[10px] font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded">Target: {item.targetSalary}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Right side: Editor/Preview */}
      <div className="w-full xl:w-2/3 h-full flex flex-col">
        {generatedEmail ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col h-full overflow-hidden relative">
            
            {/* Subject Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80">
              <div className="overflow-hidden">
                <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1">Subject</p>
                <h3 className="font-bold text-slate-900 dark:text-white truncate max-w-lg">{generatedEmail.subject}</h3>
              </div>
              <button 
                onClick={copyToClipboard}
                className="flex flex-shrink-0 items-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors shadow-sm"
              >
                {copied ? <Check size={16} className="text-blue-500 dark:text-blue-400" /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy Email'}
              </button>
            </div>
            
            {/* Email Body */}
            <div className="p-8 flex-1 overflow-y-auto scrollbar-hide bg-slate-50/30 dark:bg-slate-900/50">
              <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 p-10 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 min-h-[500px]">
                <div className="prose prose-sm sm:prose lg:prose-lg text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {generatedEmail.emailContent}
                </div>
              </div>
            </div>
            
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center p-12 h-full min-h-[500px] relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-50/50 via-white to-white dark:from-blue-900/10 dark:via-slate-800 dark:to-slate-800 z-0"></div>
            
            <div className="relative z-10 w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-800/20 rounded-full flex items-center justify-center mb-6 shadow-inner border border-blue-100 dark:border-blue-800">
              <DollarSign size={40} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="relative z-10 text-2xl font-bold text-slate-900 dark:text-white mb-3">Salary Negotiation AI</h2>
            <p className="relative z-10 text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed text-sm">
              Never leave money on the table. Enter your job offer details, and our AI will craft a strategic, persuasive, and professional counter-offer email tailored to your leverage points.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalaryNegotiation;
