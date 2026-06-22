import { useState, useContext, useEffect } from 'react';
import { Target, Zap, Building, MapPin, IndianRupee, ExternalLink, PenTool, CheckCircle, Sparkles, FileText } from 'lucide-react';
import { coverLetterService } from '../services/api';
import { useSelector } from 'react-redux';
import { AutopilotContext } from '../context/AutopilotContext';

const AutoMatch = () => {
  const [applyingTo, setApplyingTo] = useState(null);
  const { user } = useSelector(state => state.auth);

  const {
    matches,
    isLoadingMatches: isLoading,
    appliedJobs,
    setAppliedJobs,
    isAutopilotOn,
    setIsAutopilotOn,
    autopilotLogs,
    allResumes,
    activeResume,
    setActiveResume
  } = useContext(AutopilotContext);

  const handleToggleAutopilot = () => {
    if (!user?.isPro) {
      alert("24/7 Autopilot Agent is an exclusive Pro feature! Please upgrade.");
      return;
    }
    setIsAutopilotOn(!isAutopilotOn);
  };

  const handleOneClickApply = async (job) => {
    if (!user?.isPro) {
      alert("Auto-Apply Agent is a Pro feature! Please upgrade to access 1-Click Apply.");
      return;
    }

    if (isAutopilotOn) {
      alert("Autopilot is currently running. Please turn it off to apply manually.");
      return;
    }

    setApplyingTo(job._id);

    try {
      const coverLetterData = await coverLetterService.generateCoverLetter({
        targetCompany: job.company,
        targetRole: job.title,
        jobDescription: `Role: ${job.title} at ${job.company}. Required skills align with: ${job.matchReasons.join(', ')}`
      });

      navigator.clipboard.writeText(coverLetterData.content);
      setAppliedJobs([...appliedJobs, job._id]);
      window.open(job.applyUrl, '_blank');
      
      try {
         await import('../services/api').then(module => {
           module.applicationService.addApplication({
             company: job.company,
             position: job.title,
             status: 'Applied',
             dateApplied: new Date().toISOString(),
             location: job.location,
             salary: job.salary,
             source: '1-Click Apply'
           });
         });
      } catch (e) {
         console.error("Failed to sync manual application to tracker", e);
      }

      alert("Cover Letter copied to clipboard! Paste it on the application page.");

    } catch (error) {
      console.error('Auto-apply failed', error);
      alert('Failed to process auto-apply. Try again.');
    } finally {
      setApplyingTo(null);
    }
  };

  return (
    <div className="h-full flex flex-col pb-8">
      {/* Header & Autopilot Controls */}
      <div className="mb-8 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-xs font-bold uppercase tracking-widest mb-3 border border-blue-200 dark:border-blue-500/20">
            <Zap size={14} className="fill-blue-600 dark:fill-blue-400" />
            Zero-Click Automation
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2 flex items-center gap-3">
            Auto-Match Queue
            {!user?.isPro && (
              <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">
                PRO
              </span>
            )}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl">
            Review top matched jobs and apply with 1-click, or turn on the 24/7 Autopilot Agent to let AI apply for you continuously.
          </p>
        </div>

        {/* Autopilot Toggle Switch */}
        <div className={`p-4 rounded-2xl border flex flex-col gap-2 transition-all min-w-[280px] ${isAutopilotOn ? 'bg-indigo-900/10 border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.15)]' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm'}`}>
           <div className="flex justify-between items-center">
              <span className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                 <div className={`w-2 h-2 rounded-full ${isAutopilotOn ? 'bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'bg-slate-400'}`}></div>
                 24/7 Autopilot
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={isAutopilotOn} onChange={handleToggleAutopilot} />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
              </label>
           </div>
           <p className="text-[10px] text-slate-500 font-medium">When active, AI automatically applies to 90%+ matches in the background.</p>
        </div>
      </div>

      {/* Autopilot Terminal (Only visible when ON) */}
      {isAutopilotOn && (
        <div className="mb-8 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl animate-in slide-in-from-top-4 duration-500">
           <div className="bg-slate-900 px-4 py-2 flex items-center justify-between border-b border-slate-800">
              <div className="flex gap-2">
                 <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                 <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                 <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              </div>
              <span className="text-xs text-slate-500 font-mono font-bold">autopilot-agent.exe</span>
              <div className="w-4"></div>
           </div>
           <div className="p-4 h-48 overflow-y-auto font-mono text-sm flex flex-col gap-1.5 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
              {autopilotLogs.map((log, i) => (
                 <div key={i} className="flex gap-3">
                    <span className="text-slate-600 shrink-0">[{log.time}]</span>
                    <span className={`
                       ${log.type === 'info' ? 'text-blue-400' : ''}
                       ${log.type === 'process' ? 'text-amber-400' : ''}
                       ${log.type === 'success' ? 'text-emerald-400 font-bold' : ''}
                    `}>{log.msg}</span>
                 </div>
              ))}
              <div className="flex gap-3">
                 <span className="text-slate-600">[{new Date().toLocaleTimeString()}]</span>
                 <span className="text-slate-400 animate-pulse">_</span>
              </div>
           </div>
        </div>
      )}

      {/* Active Context Banner */}
      <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border border-blue-100 dark:border-blue-800/30 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <Sparkles size={20} />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Active Application Context
            </h3>
            
            <div className="mt-1 flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">Targeting Resume:</span>
              <select 
                className="text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded py-1 px-2 focus:ring-1 focus:ring-indigo-500 cursor-pointer max-w-[200px] truncate"
                value={activeResume?._id || ''}
                onChange={(e) => {
                  const selected = allResumes.find(r => r._id === e.target.value);
                  if (selected) setActiveResume(selected);
                }}
                disabled={isAutopilotOn || allResumes.length === 0}
              >
                {allResumes.length === 0 && <option value="">Basic Profile (No Resume)</option>}
                {allResumes.map(r => (
                  <option key={r._id} value={r._id}>{r.fileName || `Resume ${new Date(r.createdAt).toLocaleDateString()}`}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {activeResume && activeResume.analysis && activeResume.analysis.strengths && (
          <div className="flex gap-2 flex-wrap max-w-md mt-2 md:mt-0">
             <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider w-full mb-0.5 flex justify-between items-center">
               <span>Top Matched Skills Extracted:</span>
               <button 
                  onClick={() => alert(`Active Resume Text being sent:\n\n${activeResume.extractedText.substring(0, 500)}...\n\n(Full resume is attached to applications)`)}
                  className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 bg-blue-500/10 px-2 py-0.5 rounded transition-colors"
               >
                 <FileText size={12} /> View Resume Sent
               </button>
             </div>
             {activeResume.analysis.strengths.slice(0, 5).map(skill => (
                <span key={skill} className="px-2 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 shadow-sm font-medium">
                  {skill}
                </span>
             ))}
             {activeResume.analysis.strengths.length > 5 && (
               <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 font-medium">
                  +{activeResume.analysis.strengths.length - 5} more
               </span>
             )}
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-4 border-blue-200 dark:border-blue-900/50 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-600 dark:border-blue-500 rounded-full border-t-transparent animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
               <Target className="text-blue-600 dark:text-blue-400 animate-pulse" size={24} />
            </div>
          </div>
          <p className="mt-6 font-bold text-slate-700 dark:text-slate-300">AI is analyzing the market...</p>
          <p className="text-sm text-slate-500">Cross-referencing your resume against top companies.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {matches.map(job => {
            const isApplied = appliedJobs.includes(job._id);
            const isProcessing = applyingTo === job._id;

            return (
              <div 
                key={job._id} 
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex flex-col transition-all hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 relative overflow-hidden"
              >
                {/* Match Score Badge */}
                <div className="absolute top-0 right-0 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white font-black text-sm px-4 py-1.5 rounded-bl-xl shadow-sm z-10 flex items-center gap-1">
                  <Target size={14} />
                  {job.matchScore}% Match
                </div>

                <div className="flex items-start gap-4 mb-4 mt-2">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center font-bold text-xl text-slate-400 dark:text-slate-500 shadow-inner flex-shrink-0">
                    {job.company.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight mb-1">{job.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 font-medium">
                      <span className="flex items-center gap-1"><Building size={14} /> {job.company}</span>
                      <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6 flex-1">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-300 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-amber-500" /> Why you're a match:
                  </h4>
                  <ul className="space-y-2">
                    {job.matchReasons.map((reason, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <CheckCircle size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-bold bg-slate-50 dark:bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                    <IndianRupee size={14} className="text-emerald-600 dark:text-emerald-400" /> {job.salary}
                  </div>
                  
                  <button
                    onClick={() => handleOneClickApply(job)}
                    disabled={isProcessing || isApplied}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${
                      isApplied
                        ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 border border-emerald-200 dark:border-emerald-800 cursor-not-allowed'
                        : isProcessing
                        ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 cursor-wait'
                        : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-blue-500/20 hover:-translate-y-0.5'
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                        Auto-filling...
                      </>
                    ) : isApplied ? (
                      <>
                        <CheckCircle size={16} /> Applied
                      </>
                    ) : (
                      <>
                        <Zap size={16} className="fill-current" /> 1-Click Apply
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AutoMatch;
