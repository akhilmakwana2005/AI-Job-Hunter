import { useState, useEffect } from 'react';
import { TrendingUp, AlertTriangle, CheckCircle, BookOpen, ExternalLink, Loader } from 'lucide-react';
import { resumeService } from '../services/api';
import { Link } from 'react-router-dom';

const SkillGap = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSkillGap = async () => {
      try {
        const result = await resumeService.getSkillGap();
        setData(result);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch skill gap analysis');
      } finally {
        setLoading(false);
      }
    };
    fetchSkillGap();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-3xl mx-auto mt-10 p-8 bg-white border border-rose-100 rounded-xl shadow-sm text-center">
        <AlertTriangle className="mx-auto text-rose-500 mb-4" size={48} />
        <h2 className="text-xl font-bold text-slate-900 mb-2">Analysis Unavailable</h2>
        <p className="text-slate-600 mb-6">{error}</p>
        <Link to="/resume" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
          Upload a Resume First
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Skill Gap Analysis</h1>
        <p className="text-slate-500 dark:text-slate-400">Compare your current profile against market demands for your target role.</p>
      </div>

      {/* Full-width Market Match Banner */}
      <div className="bg-gradient-to-br from-white to-blue-50/30 dark:from-slate-800 dark:to-blue-900/10 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 flex flex-col md:flex-row items-center gap-10 hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        
        <div className="relative w-40 h-40 flex-shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <path className="text-slate-100 dark:text-slate-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
            <path className="text-blue-500 drop-shadow-sm transition-all duration-1000 ease-out" strokeDasharray={`${data.matchPercentage}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-slate-800 rounded-full m-2 shadow-sm border border-slate-50 dark:border-slate-700">
            <span className="text-4xl font-extrabold text-blue-600 dark:text-blue-400">{data.matchPercentage}%</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Match</span>
          </div>
        </div>
        
        <div className="text-center md:text-left z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 mb-3 border border-blue-100 dark:border-blue-800/50">
            <TrendingUp size={14} /> Market Readiness
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Target: <span className="text-blue-600 dark:text-blue-400">{data.targetRole}</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed max-w-2xl">
            {data.matchPercentage >= 80 
              ? "Your skills are highly aligned with market demands for this role. Focus on highlighting these strengths in interviews."
              : "Your profile has a solid foundation, but acquiring the identified missing skills will significantly boost your market value."}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Verified Strong Skills */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3 text-xl border-b border-slate-100 dark:border-slate-700 pb-4">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg text-emerald-500">
              <CheckCircle size={22} />
            </div>
            Verified Strong Skills
          </h3>
          <div className="flex flex-wrap gap-3">
            {data.strongSkills.map((skill, i) => (
              <span key={i} className="px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-sm font-bold border border-emerald-100 dark:border-emerald-800/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors shadow-sm cursor-default">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Identified Skill Gaps */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3 text-xl border-b border-slate-100 dark:border-slate-700 pb-4">
            <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-lg text-amber-500">
              <AlertTriangle size={22} />
            </div>
            Action Required
          </h3>
          
          <div className="space-y-4">
            {data.missingSkills.map((skill, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-500/30 transition-all duration-300 group">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{skill.name}</h4>
                  </div>
                  <span className={`inline-block text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full font-bold shadow-sm ${skill.importance === 'High' ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/50' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50'}`}>
                    {skill.importance} Priority
                  </span>
                </div>
                
                <div className="mt-3 sm:mt-0 flex-shrink-0">
                  <button 
                    onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(skill.name + ' tutorial')}`, '_blank')}
                    className="w-full sm:w-auto inline-flex items-center justify-center text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-lg hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all shadow-sm"
                  >
                    <BookOpen size={16} className="mr-2" /> Learn
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillGap;
