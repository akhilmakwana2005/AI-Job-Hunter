import { useState, useEffect } from 'react';
import { 
  Briefcase, 
  PhoneCall, 
  Bookmark, 
  TrendingUp, 
  MapPin, 
  IndianRupee, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useSelector } from 'react-redux';
import { applicationService, interviewService, jobService } from '../services/api';

const Dashboard = () => {
  const { user } = useSelector(state => state.auth);
  const firstName = user?.name ? user.name.split(' ')[0] : 'Guest';
  
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const apps = await applicationService.getApplications();
        setApplications(apps);
        
        const ints = await interviewService.getInterviews();
        setInterviews(ints);

        const jobs = await jobService.getJobs();
        setRecommendedJobs(jobs.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const processChartData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const data = [];
    
    for (let i = 5; i >= 0; i--) {
      let mIndex = currentMonth - i;
      if (mIndex < 0) mIndex += 12;
      data.push({ name: months[mIndex], applications: 0 });
    }
    
    applications.forEach(app => {
      const appDate = new Date(app.dateApplied);
      const mName = months[appDate.getMonth()];
      const dataItem = data.find(d => d.name === mName);
      if (dataItem) {
        dataItem.applications += 1;
      }
    });
    
    return data;
  };

  const chartData = processChartData();

  const handleEasyApply = async (job) => {
    try {
      await applicationService.addApplication({
        company: job.company,
        position: job.title,
        location: job.location,
        salary: job.salaryRange,
        status: 'Applied'
      });
      const apps = await applicationService.getApplications();
      setApplications(apps);
      alert('Application tracked! Redirecting to the application page...');
      if (job.applyLink) {
        window.open(job.applyLink, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      console.error('Failed to add application', error);
      alert('Failed to apply. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 rounded-2xl p-8 text-white flex flex-col md:flex-row md:items-center justify-between shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-48 h-48 bg-indigo-400 opacity-20 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back, {firstName}! 👋</h1>
          <p className="text-indigo-100 text-lg">Here is what's happening with your job search today.</p>
        </div>
        <button className="mt-6 md:mt-0 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-indigo-700 bg-white hover:bg-indigo-50 shadow-sm transition-colors self-start md:self-auto">
          <Briefcase size={20} className="mr-2" />
          Find New Jobs
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300">
              <Briefcase size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Applications</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{applications.filter(a => a.status !== 'Saved').length}</h3>
            </div>
          </div>
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700">
            Active: {applications.filter(a => a.status !== 'Rejected' && a.status !== 'Saved').length}
          </span>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300">
              <PhoneCall size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Interview Calls</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{interviews.length}</h3>
            </div>
          </div>
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700">
            +2 this week
          </span>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform duration-300">
              <Bookmark size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Saved Jobs</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{applications.filter(a => a.status === 'Saved').length}</h3>
            </div>
          </div>
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
            5 new today
          </span>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform duration-300">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Profile Strength</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">92%</h3>
            </div>
          </div>
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700">
            Top 5% of applicants
          </span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-colors">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Application Activity</h3>
            <select className="block w-32 pl-3 pr-10 py-2 text-base border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-slate-50 dark:bg-slate-700 dark:text-white transition-colors">
              <option>Last 6 Months</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: '#4F46E5', fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="applications" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorApps)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex flex-col transition-colors">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Latest ATS Score</h3>
          <div className="flex-1 flex flex-col items-center justify-center">
            {/* Custom Circular Progress */}
            <div className="relative w-40 h-40 flex items-center justify-center mb-6">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path 
                  className="text-slate-100" 
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="3"
                />
                <path 
                  className="text-emerald-500" 
                  strokeDasharray="85, 100" 
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="3" 
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white transition-colors">85</span>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400 transition-colors">/100</span>
              </div>
            </div>
            
            <div className="w-full space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <CheckCircle size={18} className="text-emerald-500 mt-0.5" />
                <span className="text-sm text-slate-700 dark:text-slate-300 transition-colors">Keyword match: High</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle size={18} className="text-emerald-500 mt-0.5" />
                <span className="text-sm text-slate-700 dark:text-slate-300 transition-colors">Formatting is ATS readable</span>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle size={18} className="text-amber-500 mt-0.5" />
                <span className="text-sm text-slate-700 dark:text-slate-300 transition-colors">Missing "Cloud Architecture" skill</span>
              </div>
            </div>
            
            <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-slate-300 dark:border-slate-600 shadow-sm text-sm font-medium rounded-md text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">
              Optimize Resume
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-8 mb-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">AI Job Recommendations</h2>
        <a href="#" className="text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">View all</a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendedJobs.length > 0 ? recommendedJobs.map((job) => (
          <div key={job._id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-400 dark:text-slate-300">
                  {job.company.charAt(0)}
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400">
                  {job.matchScore || 90}% Match
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{job.title}</h3>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">{job.company} • {job.workType}</p>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                  <MapPin size={16} className="mr-2 text-slate-400 dark:text-slate-500" /> {job.location}
                </div>
                <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                  <IndianRupee size={16} className="mr-2 text-slate-400 dark:text-slate-500" /> {job.salaryRange}
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => handleEasyApply(job)}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors mt-auto">
              Easy Apply
            </button>
          </div>
        )) : (
          <p className="col-span-3 text-center text-slate-500 py-8">No recommended jobs available yet.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
