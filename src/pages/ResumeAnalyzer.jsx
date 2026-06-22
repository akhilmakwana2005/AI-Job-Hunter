import { useState, useEffect, useRef } from 'react';
import { UploadCloud, FileText, Target, CheckCircle, AlertCircle, TrendingUp, Search, Sparkles, Activity, FileCheck, Circle, Wand2, Copy, Download, RefreshCw } from 'lucide-react';
import { resumeService } from '../services/api';

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [targetRole, setTargetRole] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanStatus, setScanStatus] = useState('');
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [checkedSuggestions, setCheckedSuggestions] = useState({});
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);
  const [fileError, setFileError] = useState('');

  // Rewriter States
  const [rewriteText, setRewriteText] = useState('');
  const [rewrittenOptions, setRewrittenOptions] = useState([]);
  const [isRewriting, setIsRewriting] = useState(false);

  // Full Recreate States
  const [recreatedResume, setRecreatedResume] = useState(null);
  const [isRecreating, setIsRecreating] = useState(false);
  const printRef = useRef();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await resumeService.getResumes();
      setHistory(data);
      if (data.length > 0) {
        setResults(data[0]);
        setAnimatedScore(data[0].latestAtsScore);
      }
    } catch (error) {
      console.error('Failed to fetch resume history', error);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
      const validExtensions = ['pdf', 'doc', 'docx'];

      if (!validTypes.includes(selectedFile.type) && !validExtensions.includes(fileExtension)) {
        setFileError('Please upload a valid resume document (PDF or DOCX).');
        setFile(null);
        e.target.value = null;
        return;
      }

      setFileError('');
      setFile(selectedFile);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setFileError('Add resume now');
      return;
    }
    if (!targetRole) {
      setFileError('Please enter a target job role.');
      return;
    }
    setFileError('');

    setIsAnalyzing(true);
    setAnimatedScore(0);
    setResults(null);
    setCheckedSuggestions({});

    const statuses = [
      'Extracting text from resume...',
      'Analyzing keyword density...',
      'Evaluating ATS compatibility...',
      'Generating AI insights...'
    ];
    let statusIndex = 0;
    setScanStatus(statuses[0]);
    const statusInterval = setInterval(() => {
      statusIndex = (statusIndex + 1) % statuses.length;
      setScanStatus(statuses[statusIndex]);
    }, 1200);

    try {
      const formData = new FormData();
      formData.append('resumeFile', file);
      formData.append('fileName', file.name);
      formData.append('targetRole', targetRole);

      const data = await resumeService.analyzeResume(formData);
      clearInterval(statusInterval);
      setResults(data);
      setHistory([data, ...history]);
      setFile(null);
    } catch (error) {
      clearInterval(statusInterval);
      console.error('Failed to analyze resume', error);
      const errorMessage = error.response?.data?.message || 'Failed to analyze. Please try again.';
      setFileError(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (results && animatedScore < results.latestAtsScore) {
      const timer = setInterval(() => {
        setAnimatedScore(prev => {
          if (prev < results.latestAtsScore) return prev + 1;
          clearInterval(timer);
          return prev;
        });
      }, 20);
      return () => clearInterval(timer);
    } else if (results) {
      setAnimatedScore(results.latestAtsScore);
    }
  }, [results]);

  const toggleSuggestion = (index) => {
    setCheckedSuggestions(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleRewrite = async (e) => {
    e.preventDefault();
    if (!rewriteText) return;
    setIsRewriting(true);
    setRewrittenOptions([]);
    try {
      const data = await resumeService.rewriteResume({ originalText: rewriteText });
      setRewrittenOptions(data);
    } catch (error) {
      console.error('Failed to rewrite', error);
      alert('Failed to generate rewrite.');
    } finally {
      setIsRewriting(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const handleRecreate = async () => {
    if (!results || !results._id) return;
    setIsRecreating(true);
    setRecreatedResume(null);
    try {
      const data = await resumeService.recreateResume({
        resumeId: results._id,
        targetRole: targetRole || 'Professional'
      });
      setRecreatedResume(data);
    } catch (error) {
      console.error('Failed to recreate resume', error);
      if (error.response?.status === 429) {
        setCooldown(60);
        if (error.response.data?.fallback) {
          setRecreatedResume(error.response.data.fallback);
        }
      } else {
        alert(error.response?.data?.message || 'Failed to recreate resume. Please ensure the original text is available.');
      }
    } finally {
      setIsRecreating(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!printRef.current) return;

    const content = printRef.current.innerHTML;
    const printWindow = window.open('', '', 'height=800,width=800');

    printWindow.document.write('<html><head><title>Resume - ' + (recreatedResume?.fullName || 'ATS') + '</title>');
    printWindow.document.write('<script src="https://cdn.tailwindcss.com"></script>');
    // Setting @page margin to 0 completely removes browser headers and footers (date, URL)
    printWindow.document.write('<style>@page { size: a4 portrait; margin: 0; } body { padding: 15mm; margin: 0; background-color: white; color: #0f172a; }</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write('<div class="max-w-4xl mx-auto font-sans">');
    printWindow.document.write(content);
    printWindow.document.write('</div></body></html>');
    printWindow.document.close();

    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      // Optional: printWindow.close(); 
      // User can close it themselves or it stays open if they cancel. Best to close after print dialog finishes, but browsers block JS execution during print dialog anyway.
      printWindow.onafterprint = () => printWindow.close();
    }, 1000);
  };

  return (
    <div className="flex flex-col xl:flex-row gap-8 min-h-full">
      {/* Left side: Upload & Form */}
      <div className="w-full xl:w-1/3 flex flex-col gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 relative overflow-hidden group flex-shrink-0">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
          <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <FileText size={20} />
            </div>
            <h2 className="text-lg font-bold text-slate-900">New AI Analysis</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Target Job Role</label>
              <input
                type="text"
                placeholder="e.g. Senior Frontend Engineer"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Upload Resume (PDF/DOCX)</label>
              <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer relative group ${file ? 'border-blue-400 bg-blue-50/50 dark:bg-blue-900/30' : 'border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                />
                {file ? (
                  <div className="flex flex-col items-center">
                    <div className="h-16 w-16 bg-white dark:bg-slate-800 shadow-sm text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <FileCheck size={32} />
                    </div>
                    <p className="text-sm font-bold text-blue-900 dark:text-blue-300 truncate max-w-full">{file.name}</p>
                    <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      <UploadCloud size={32} />
                    </div>
                    <p className="text-sm font-bold text-slate-900">Drag & drop or click</p>
                    <p className="text-xs text-slate-500 mt-1">PDF or Word document</p>
                  </div>
                )}
              </div>
              {fileError && (
                <p className="mt-2 text-sm text-rose-600 font-medium flex items-center gap-1">
                  <AlertCircle size={14} /> {fileError}
                </p>
              )}
            </div>

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="relative w-full flex justify-center items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg py-4 text-sm font-bold hover:from-blue-700 hover:to-blue-600 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden group"
            >
              {isAnalyzing ? (
                <>
                  <Activity size={20} className="animate-pulse" />
                  <div className="flex flex-col items-start ml-2 text-left">
                    <span className="text-xs opacity-80 uppercase tracking-widest">Scanning</span>
                    <span className="text-sm">{scanStatus}</span>
                  </div>
                  {/* Scanning line animation */}
                  <div className="absolute inset-0 h-full w-full pointer-events-none">
                    <div className="w-full h-1 bg-white opacity-40 shadow-[0_0_8px_2px_rgba(255,255,255,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
                  </div>
                </>
              ) : (
                <>
                  <Sparkles size={20} className="group-hover:scale-110 transition-transform" />
                  Analyze with AI
                </>
              )}
            </button>
          </div>
        </div>

        {/* History Widget */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex-1 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
          <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider flex items-center gap-2">
            <TrendingUp size={16} className="text-blue-500" /> Past Analyses
          </h3>
          <div className="space-y-3">
            {history.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700 border-dashed">
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">No past analyses found.</p>
              </div>
            ) : (
              history.map((item, idx) => (
                <div
                  key={item._id || idx}
                  onClick={() => { setResults(item); setAnimatedScore(0); }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md ${results?._id === item._id ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/30 shadow-sm' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}
                >
                  <p className="text-sm font-bold text-slate-900 truncate pr-8">{item.fileName}</p>
                  <div className="flex justify-between items-end mt-2">
                    <p className="text-xs font-medium text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</p>
                    <div className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 text-xs font-bold ${item.latestAtsScore >= 80 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {item.latestAtsScore}% ATS
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Right side: Results */}
      <div className="w-full xl:w-2/3">
        {isAnalyzing ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center p-12 h-full min-h-[500px] relative overflow-hidden">
            {/* Background glowing effect */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500 opacity-10 blur-3xl rounded-full animate-pulse"></div>

            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 relative">
              <FileText size={40} className="text-blue-600" />
              <div className="absolute inset-0 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">AI is analyzing your resume</h2>
            <p className="text-slate-500 font-medium text-lg">{scanStatus}</p>
          </div>
        ) : results ? (
          <div className="space-y-6">
            {/* Score Banner */}
            <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900/80 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 p-8 flex flex-col md:flex-row items-center gap-10 hover:shadow-lg transition-shadow">
              <div className="relative w-40 h-40 flex-shrink-0 group">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none" stroke="currentColor" strokeWidth="3"
                  />
                  <path
                    className={`text-blue-500 transition-all duration-1000 ease-out`}
                    strokeDasharray={`${animatedScore}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-slate-800 rounded-full m-2 shadow-sm">
                  <span className={`text-4xl font-extrabold text-blue-600 dark:text-blue-400`}>
                    {animatedScore}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">ATS Score</span>
                </div>
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 mb-3">
                  <Sparkles size={14} /> AI Analysis Complete
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-3">
                  {animatedScore >= 80 ? "Excellent Match! 🎯" : animatedScore >= 60 ? "Good, but needs work 📈" : "Needs Major Optimization ⚠️"}
                </h2>
                <p className="text-slate-600 text-lg leading-relaxed font-medium">
                  {animatedScore >= 80
                    ? "Your resume is highly optimized for ATS systems and perfectly aligns with the target role."
                    : "Your resume needs structural changes and missing keywords to pass through ATS systems effectively."}
                </p>
              </div>
            </div>

            {/* Missing Keywords */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:-translate-y-1 transition-transform duration-300">
              <div className="flex items-center gap-3 mb-5 border-b border-slate-100 pb-4">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <Search size={20} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Missing Keywords</h3>
                <span className="ml-auto bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full">
                  Add these to boost your score
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                {results.analysis.missingKeywords.length > 0 ? (
                  results.analysis.missingKeywords.map((kw, i) => (
                    <span key={i} className="px-4 py-2 rounded-lg bg-white shadow-sm border border-slate-200 text-slate-700 text-sm font-bold flex items-center gap-2 hover:border-blue-400 hover:text-blue-600 transition-colors cursor-default">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      {kw}
                    </span>
                  ))
                ) : (
                  <p className="text-emerald-600 font-medium text-sm">Great job! No critical keywords missing.</p>
                )}
              </div>
            </div>

            {/* Strengths & Weaknesses Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-900/20 dark:to-slate-800 rounded-xl shadow-sm border border-emerald-100 dark:border-emerald-900/30 p-6 hover:-translate-y-1 transition-transform duration-300">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg text-emerald-600 dark:text-emerald-400">
                    <TrendingUp size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-emerald-900">Strengths</h3>
                </div>
                <ul className="space-y-4">
                  {results.analysis.strengths.map((str, i) => (
                    <li key={i} className="flex gap-3 text-emerald-800 text-sm font-medium">
                      <CheckCircle size={18} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-white dark:from-amber-900/20 dark:to-slate-800 rounded-xl shadow-sm border border-amber-100 dark:border-amber-900/30 p-6 hover:-translate-y-1 transition-transform duration-300">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg text-amber-600 dark:text-amber-400">
                    <AlertCircle size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-amber-900">Weaknesses</h3>
                </div>
                <ul className="space-y-4">
                  {results.analysis.weaknesses.map((wk, i) => (
                    <li key={i} className="flex gap-3 text-amber-800 text-sm font-medium">
                      <AlertCircle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{wk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Actionable Suggestions (Interactive) */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Target size={20} className="text-blue-600" /> Action Plan
                </h3>
                <button
                  onClick={handleRecreate}
                  disabled={isRecreating || cooldown > 0}
                  className={`flex items-center justify-center gap-2 font-bold py-2 px-5 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-80 disabled:cursor-not-allowed ${cooldown > 0
                      ? 'bg-amber-500 hover:bg-amber-600 text-white'
                      : 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white'
                    }`}
                >
                  {isRecreating ? (
                    <><RefreshCw size={18} className="animate-spin" /> AI is Working...</>
                  ) : cooldown > 0 ? (
                    <><RefreshCw size={18} /> Wait {cooldown}s (AI Limit)</>
                  ) : (
                    <><Wand2 size={18} /> Fix All & Recreate Resume</>
                  )}
                </button>
              </div>

              {isRecreating && (
                <div className="mb-6 p-6 rounded-xl bg-slate-900 text-white relative overflow-hidden animate-in fade-in zoom-in duration-500 border border-slate-800">
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,107,253,0.2)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] animate-[bg-pan_3s_linear_infinite]" />
                  <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                    <Wand2 size={40} className="text-emerald-400 animate-bounce" />
                    <div>
                      <h4 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-blue-400">
                        AI is completely rebuilding your resume
                      </h4>
                      <div className="flex flex-col items-center mt-3 space-y-2">
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <CheckCircle size={14} className="text-emerald-500" /> Scanning original text
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <CheckCircle size={14} className="text-emerald-500" /> Fixing weaknesses & rewriting bullets
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-300 animate-pulse">
                          <Activity size={14} className="text-blue-400" /> Optimizing for ATS format...
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {results.analysis.suggestions.map((sug, i) => (
                  <div
                    key={i}
                    onClick={() => toggleSuggestion(i)}
                    className={`flex gap-4 items-start p-4 rounded-xl shadow-sm border transition-all cursor-pointer ${checkedSuggestions[i] ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500'
                      }`}
                  >
                    <div className="mt-0.5 flex-shrink-0">
                      {checkedSuggestions[i] ? (
                        <CheckCircle size={22} className="text-emerald-500" />
                      ) : (
                        <Circle size={22} className="text-slate-300" />
                      )}
                    </div>
                    <p className={`text-sm font-medium leading-relaxed transition-all ${checkedSuggestions[i] ? 'text-emerald-700 line-through opacity-70' : 'text-slate-700'
                      }`}>
                      {sug}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Resume Rewriter Module */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-xl shadow-lg border border-blue-800 p-8 text-white relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
              <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-1/4 -translate-y-1/4 pointer-events-none group-hover:rotate-12 transition-transform duration-700">
                <Wand2 size={150} />
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  <Wand2 className="text-blue-400" /> Auto-Fix Single Bullet
                </h3>
                <p className="text-blue-200 mb-6 max-w-xl text-sm leading-relaxed">
                  Have a weak bullet point? Paste it below and our AI will instantly rewrite it into 3 highly professional, action-oriented, and ATS-friendly variations.
                </p>

                <form onSubmit={handleRewrite} className="space-y-4">
                  <textarea
                    rows={3}
                    required
                    placeholder="e.g. 'I made the website faster' or 'Helped the sales team'"
                    className="w-full bg-white/10 border border-blue-400/30 rounded-lg p-4 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none text-sm"
                    value={rewriteText}
                    onChange={(e) => setRewriteText(e.target.value)}
                  />
                  <button
                    type="submit"
                    disabled={isRewriting || !rewriteText}
                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2.5 px-6 rounded-lg transition-colors shadow-md disabled:opacity-50 text-sm"
                  >
                    {isRewriting ? (
                      <><Activity size={18} className="animate-spin" /> Rewriting...</>
                    ) : (
                      <><Sparkles size={18} /> Rewrite Professionally</>
                    )}
                  </button>
                </form>

                {rewrittenOptions.length > 0 && (
                  <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-blue-300 border-b border-blue-800 pb-2">AI Suggestions</h4>
                    {rewrittenOptions.map((opt, i) => (
                      <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-4 flex gap-4 hover:bg-white/10 transition-colors">
                        <div className="flex-1">
                          <p className="text-sm font-medium leading-relaxed">{opt}</p>
                        </div>
                        <button
                          onClick={() => handleCopy(opt)}
                          className="h-8 w-8 rounded bg-white/10 flex items-center justify-center hover:bg-white/20 hover:text-blue-300 transition-colors flex-shrink-0"
                          title="Copy to clipboard"
                        >
                          <Copy size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Fully Recreated Resume Preview */}
            {recreatedResume && (
              <div className="mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                      <FileCheck className="text-emerald-500" /> Your New ATS-Optimized Resume
                    </h3>
                    <p className="text-slate-500 text-sm mt-1">Review your AI-recreated resume below and download the PDF.</p>
                  </div>
                  <button
                    onClick={handleDownloadPDF}
                    className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-6 rounded-lg transition-all shadow-md hover:shadow-lg"
                  >
                    <Download size={18} /> Download PDF
                  </button>
                </div>

                {/* Resume Paper Preview */}
                <div className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200 overflow-hidden relative">
                  <div ref={printRef} className="print-content bg-white w-full max-w-3xl mx-auto p-8 text-slate-900 font-serif text-[10pt] leading-snug">

                    {/* Header */}
                    <div className="text-center mb-4 border-b-2 border-slate-900 pb-3">
                      <h1 className="text-2xl font-bold text-slate-900 mb-1 uppercase tracking-wide">{recreatedResume.fullName}</h1>
                      <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-[9pt] font-medium text-slate-700">
                        {recreatedResume.contact?.email && <span>{recreatedResume.contact.email}</span>}
                        {recreatedResume.contact?.phone && <span>• {recreatedResume.contact.phone}</span>}
                        {recreatedResume.contact?.linkedin && (
                          <span>
                            • <a
                              href={recreatedResume.contact.linkedin.startsWith('http') ? recreatedResume.contact.linkedin : `https://${recreatedResume.contact.linkedin}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-slate-700 font-bold hover:text-blue-600 underline"
                            >
                              LinkedIn
                            </a>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Professional Summary */}
                    {recreatedResume.summary && (
                      <div className="mb-4">
                        <h2 className="text-[10pt] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-0.5 mb-1.5">Professional Summary</h2>
                        <p className="text-[9.5pt] text-justify leading-snug">{recreatedResume.summary}</p>
                      </div>
                    )}

                    {/* Core Skills */}
                    {recreatedResume.skills && recreatedResume.skills.length > 0 && (
                      <div className="mb-4">
                        <h2 className="text-[10pt] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-0.5 mb-1.5">Core Competencies</h2>
                        <div className="flex flex-wrap gap-x-2 gap-y-0.5">
                          {recreatedResume.skills.map((skill, i) => (
                            <span key={i} className="text-[9.5pt] font-semibold">{skill} {i !== recreatedResume.skills.length - 1 && ' | '}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Experience */}
                    {recreatedResume.experience && recreatedResume.experience.length > 0 && (
                      <div className="mb-4">
                        <h2 className="text-[10pt] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-0.5 mb-2">Professional Experience</h2>
                        <div className="space-y-3">
                          {recreatedResume.experience.map((exp, i) => (
                            <div key={i}>
                              <div className="flex justify-between items-baseline font-bold text-slate-900 mb-0.5">
                                <h3 className="text-[10pt]">{exp.role}</h3>
                                <span className="text-[9pt]">{exp.duration}</span>
                              </div>
                              <div className="text-[9.5pt] font-bold text-slate-700 italic mb-1">{exp.company}</div>
                              <ul className="list-disc pl-4 space-y-0.5 text-[9.5pt]">
                                {exp.achievements.map((ach, j) => (
                                  <li key={j} className="pl-0.5">{ach}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Education */}
                    {recreatedResume.education && recreatedResume.education.length > 0 && (
                      <div>
                        <h2 className="text-[10pt] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-0.5 mb-2">Education</h2>
                        <div className="space-y-2">
                          {recreatedResume.education.map((edu, i) => (
                            <div key={i} className="flex justify-between items-baseline">
                              <div>
                                <h3 className="text-[9.5pt] font-bold text-slate-900">{edu.degree}</h3>
                                <div className="text-[9pt] text-slate-700">{edu.institution}</div>
                              </div>
                              <span className="text-[9pt] font-bold text-slate-900">{edu.year}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center p-12 h-full min-h-[500px]">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
              <Sparkles size={40} className="text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Upload a resume to get started</h2>
            <p className="text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
              Our advanced AI will scan your resume against industry standards, identify missing keywords, and provide actionable suggestions to dramatically improve your ATS score.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
