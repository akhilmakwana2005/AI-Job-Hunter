import { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, TrendingUp, Target, Zap, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { applicationService, resumeService, interviewService } from '../services/api';

const AIRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [apps, resumes, interviews] = await Promise.all([
        applicationService.getApplications().catch(() => []),
        resumeService.getResumes().catch(() => []),
        interviewService.getInterviews().catch(() => [])
      ]);

      const recs = [];

      // Logic 1: Resume Analysis
      if (!resumes || resumes.length === 0) {
        recs.push({
          id: 'upload-resume',
          type: 'primary',
          title: 'Upload and Analyze Your Resume',
          description: 'You haven\'t uploaded a resume yet. Let our AI analyze it to give you a strong starting point.',
          actionText: 'Upload Resume',
          link: '/dashboard/resume',
          icon: <FileText size={150} />
        });
      } else {
        const latestResume = resumes[0]; // assuming sorted by newest
        if (!latestResume.latestAtsScore || latestResume.latestAtsScore < 80) {
          recs.push({
            id: 'fix-resume',
            type: 'primary',
            title: 'Improve your Resume ATS Score',
            description: `Your latest resume scored ${latestResume.latestAtsScore || 0}%. Tailoring it using our AI suggestions can significantly boost your interview chances.`,
            actionText: 'Fix Resume Now',
            link: '/dashboard/resume',
            icon: <Target size={150} />,
            smallIcon: <Target size={24} />
          });
        }
      }

      // Logic 2: Interviews
      if (!interviews || interviews.length === 0) {
        recs.push({
          id: 'mock-interview',
          type: 'secondary',
          title: 'Practice Behavioral Interviews',
          description: "You haven't done any mock interviews. Practicing leadership questions builds confidence.",
          actionText: 'Start Mock Interview',
          link: '/dashboard/mock-interview',
          icon: <Zap size={24} />,
          color: 'amber'
        });
      } else {
        recs.push({
           id: 'mock-interview-more',
           type: 'secondary',
           title: 'Keep Practicing Interviews',
           description: "You've done some practice, but consistency is key! Try a new technical interview scenario.",
           actionText: 'Practice More',
           link: '/dashboard/mock-interview',
           icon: <Zap size={24} />,
           color: 'amber'
        });
      }

      // Logic 3: Saved Applications
      const savedApps = apps ? apps.filter(app => app.status === 'Saved') : [];
      if (savedApps.length > 0) {
        recs.push({
          id: 'apply-saved',
          type: 'secondary',
          title: `Apply to ${savedApps.length} Saved Job${savedApps.length > 1 ? 's' : ''}`,
          description: `You have ${savedApps.length} job${savedApps.length > 1 ? 's' : ''} waiting in your "Saved" column. Don't miss out on these opportunities!`,
          actionText: 'View Kanban Board',
          link: '/dashboard/applications',
          icon: <TrendingUp size={24} />,
          color: 'blue'
        });
      } else {
        recs.push({
          id: 'find-jobs',
          type: 'secondary',
          title: 'Find New Opportunities',
          description: 'You have no saved jobs. Let the AI find some tailored matches for you today.',
          actionText: 'Search Jobs',
          link: '/dashboard/jobs',
          icon: <Sparkles size={24} />,
          color: 'indigo'
        });
      }

      // If we don't have a primary recommendation yet, make the first secondary a primary
      const hasPrimary = recs.some(r => r.type === 'primary');
      if (!hasPrimary && recs.length > 0) {
        recs[0].type = 'primary';
        recs[0].icon = <Target size={150} />;
        recs[0].smallIcon = <Target size={24} />;
      }

      setRecommendations(recs);
    } catch (error) {
      console.error('Failed to fetch recommendation data', error);
    } finally {
      setIsLoading(false);
    }
  };

  const primaryRec = recommendations.find(r => r.type === 'primary');
  const secondaryRecs = recommendations.filter(r => r.type === 'secondary').slice(0, 3); // Max 3

  return (
    <div className="max-w-5xl mx-auto space-y-8 h-full">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">AI Recommendations</h1>
        <p className="text-slate-500">Personalized action plan to accelerate your job search based on your activity.</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : recommendations.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <h3 className="text-lg font-bold text-slate-900 mb-2">You're all caught up!</h3>
            <p className="text-slate-500">Keep exploring jobs or practicing interviews.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Urgent Action */}
          {primaryRec && (
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-8 text-white shadow-md relative overflow-hidden group flex flex-col justify-between">
              <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                {primaryRec.icon}
              </div>
              <div className="relative z-10">
                <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
                  Highest Impact Action
                </span>
                <h2 className="text-2xl font-bold mb-2">{primaryRec.title}</h2>
                <p className="text-indigo-100 mb-8 max-w-sm">
                  {primaryRec.description}
                </p>
              </div>
              <div className="relative z-10 mt-auto">
                <Link 
                  to={primaryRec.link} 
                  className="inline-flex items-center justify-center px-4 py-2 bg-white text-indigo-600 font-bold rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
                >
                  {primaryRec.actionText} <ArrowRight size={16} className="ml-2" />
                </Link>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* Secondary Actions */}
            {secondaryRecs.map((rec) => {
               let bgColor = 'bg-slate-50';
               let textColor = 'text-slate-600';
               if (rec.color === 'amber') { bgColor = 'bg-amber-50'; textColor = 'text-amber-600'; }
               else if (rec.color === 'blue') { bgColor = 'bg-blue-50'; textColor = 'text-blue-600'; }
               else if (rec.color === 'indigo') { bgColor = 'bg-indigo-50'; textColor = 'text-indigo-600'; }

               return (
                <div key={rec.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex gap-4 hover:border-indigo-300 transition-colors">
                  <div className={`w-12 h-12 ${bgColor} ${textColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                    {rec.smallIcon || rec.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">{rec.title}</h3>
                    <p className="text-sm text-slate-500 mb-3">{rec.description}</p>
                    <Link to={rec.link} className="text-sm font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center">
                      {rec.actionText} <ArrowRight size={14} className="ml-1" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIRecommendations;
