import { useState, useEffect } from 'react';
import { Search, MapPin, IndianRupee, Briefcase, Filter, Sparkles, Bookmark } from 'lucide-react';
import { jobService, applicationService } from '../services/api';

const JobSearch = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    workType: 'any',
    experienceLevel: ''
  });
  const [apiError, setApiError] = useState(null);
  const [userApps, setUserApps] = useState([]);

  useEffect(() => {
    fetchJobs();
    fetchUserApps();
  }, []);

  const fetchUserApps = async () => {
    try {
      const apps = await applicationService.getApplications();
      setUserApps(apps);
    } catch(err) {
      console.error('Failed to fetch user applications', err);
    }
  };

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      // Clean filters
      const activeFilters = {};
      if (filters.search) activeFilters.search = filters.search;
      if (filters.location) activeFilters.location = filters.location;
      if (filters.workType !== 'any') activeFilters.workType = filters.workType;
      if (filters.experienceLevel) activeFilters.experienceLevel = filters.experienceLevel;

      setApiError(null);
      const data = await jobService.getJobs(activeFilters);
      
      // Axios error from interceptor might return undefined or an error object if not caught properly, 
      // but assuming jobService handles it or throws. If it returns an object with requiresApiKey:
      if (data && data.requiresApiKey) {
        setApiError(data.message);
        setJobs([]);
      } else {
        setJobs(data || []);
      }
    } catch (error) {
      console.error('Failed to fetch jobs', error);
      setApiError('Failed to fetch jobs. Please check your API key or connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleEasyApply = async (job) => {
    const existingApp = userApps.find(app => app.company === job.company && app.position === job.title);

    if (existingApp && existingApp.status !== 'Saved') {
      // Already tracked as Applied or further. Just redirect.
      if (job.applyLink) window.open(job.applyLink, '_blank', 'noopener,noreferrer');
      return;
    }

    try {
      if (existingApp && existingApp.status === 'Saved') {
        const updatedApp = await applicationService.updateApplication(existingApp._id, { status: 'Applied' });
        setUserApps(userApps.map(app => app._id === existingApp._id ? updatedApp : app));
      } else {
        const newApp = await applicationService.addApplication({
          company: job.company,
          position: job.title,
          location: job.location,
          salary: job.salaryRange,
          status: 'Applied'
        });
        setUserApps([...userApps, newApp]);
      }

      alert(`Successfully tracked! This job is now saved in your Application Tracker as 'Applied'. Redirecting to the application page...`);
      if (job.applyLink) {
        window.open(job.applyLink, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      console.error('Failed to apply', error);
      alert('Failed to submit application.');
    }
  };

  const handleSaveJob = async (job) => {
    const existingApp = userApps.find(app => app.company === job.company && app.position === job.title);
    if (existingApp) return; // Already saved or applied

    try {
      const newApp = await applicationService.addApplication({
        company: job.company,
        position: job.title,
        location: job.location,
        salary: job.salaryRange,
        status: 'Saved'
      });
      setUserApps([...userApps, newApp]);
    } catch (error) {
      console.error('Failed to save job', error);
      alert('Failed to save job.');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full">
      {/* Left Sidebar - Filters */}
      <div className="w-full lg:w-72 flex-shrink-0">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-6">
          <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
            <Filter size={20} className="text-slate-500" />
            <h2 className="text-lg font-bold text-slate-900">Filters</h2>
          </div>

          <form onSubmit={handleSearch} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Job title, company..."
                  className="pl-9 w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-900 transition-colors"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="City, State, or Country"
                  className="pl-9 w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-900 transition-colors"
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Work Type</label>
              <select
                className="w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-900 transition-colors"
                value={filters.workType}
                onChange={(e) => setFilters({ ...filters, workType: e.target.value })}
              >
                <option value="any">Any</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="onsite">On-site</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Experience Level</label>
              <select
                className="w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-900 transition-colors"
                value={filters.experienceLevel}
                onChange={(e) => setFilters({ ...filters, experienceLevel: e.target.value })}
              >
                <option value="">Any</option>
                <option value="Entry-Level">Entry-Level</option>
                <option value="Mid-Level">Mid-Level</option>
                <option value="Senior">Senior</option>
                <option value="Lead/Manager">Lead/Manager</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white rounded-md py-2 text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Apply Filters
            </button>
          </form>
        </div>
      </div>

      {/* Main Content - Job List */}
      <div className="flex-1">
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Recommended Jobs</h1>
            <p className="text-slate-500 text-sm">Showing AI-matched opportunities based on your profile.</p>
          </div>
          <p className="text-sm font-medium text-slate-600">{jobs.length} jobs found</p>
        </div>

        {apiError ? (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 mb-6">
            <h3 className="font-bold mb-1">Configuration Required</h3>
            <p>{apiError}</p>
            <p className="mt-2 text-sm">
              To fix this: Go to RapidAPI, search for "JSearch", subscribe to the free tier, and add your <code className="bg-red-100 px-1 rounded">RAPIDAPI_KEY</code> to the <code className="bg-red-100 px-1 rounded">server/.env</code> file.
            </p>
          </div>
        ) : isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-slate-200 rounded-md"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-5 bg-slate-200 rounded w-1/4"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : jobs.length > 0 ? (
          <div className="space-y-4">
            {jobs.map((job) => {
              const existingApp = userApps.find(app => app.company === job.company && app.position === job.title);
              const isSaved = existingApp && existingApp.status === 'Saved';
              const isApplied = existingApp && existingApp.status !== 'Saved';

              return (
                <div key={job._id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:-translate-y-1 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-500/50 transition-all duration-300 group relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Company Logo Placeholder */}
                  <div className="w-16 h-16 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-slate-300">{job.company.charAt(0)}</span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{job.title}</h3>
                        <p className="text-slate-600 font-medium">{job.company}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {job.matchScore >= 90 && (
                          <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                            <Sparkles size={12} className="mr-1" /> Top Match
                          </span>
                        )}
                        <div className="flex flex-col items-end">
                          <span className={`text-lg font-bold ${job.matchScore >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {job.matchScore}%
                          </span>
                          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Match</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-4">
                      <div className="flex items-center gap-1.5"><MapPin size={16} /> {job.location}</div>
                      <div className="flex items-center gap-1.5"><Briefcase size={16} /> {job.experienceLevel || job.workType}</div>
                      <div className="flex items-center gap-1.5"><IndianRupee size={16} /> {job.salaryRange}</div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {job.requiredSkills.map(skill => (
                        <span key={skill} className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <p className="text-xs text-slate-400">Posted {new Date(job.postedAt).toLocaleDateString()}</p>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => !isSaved && !isApplied && handleSaveJob(job)} 
                          className={`p-2 rounded-md transition-colors ${
                            isSaved ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 cursor-default' : 
                            isApplied ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 cursor-default' : 
                            'text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30'
                          }`}
                          title={isSaved ? "Saved" : isApplied ? "Applied" : "Save Job"}
                        >
                          <Bookmark size={20} className={isSaved || isApplied ? "fill-current" : ""} />
                        </button>
                        {job.applyLink ? (
                          <a 
                            href={job.applyLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="px-5 py-2 bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-400 text-sm font-medium rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors inline-flex items-center"
                          >
                            View Details
                          </a>
                        ) : (
                          <button className="px-5 py-2 bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-400 text-sm font-medium rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
                            View Details
                          </button>
                        )}
                          <button 
                            onClick={() => handleEasyApply(job)}
                            className={`px-5 py-2 text-sm font-medium rounded-md shadow-sm transition-colors ${
                              isApplied ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                            title={isApplied ? "Already tracked. Open real job link" : "Track this application and open real job link"}
                          >
                            {isApplied ? 'Applied' : 'Apply & Track'}
                          </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="mx-auto w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-4">
              <Search size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">No jobs found</h3>
            <p className="text-slate-500">We couldn't find any jobs matching your current filters.</p>
            <button 
              onClick={() => { setFilters({ search: '', workType: 'any', experienceLevel: '' }); fetchJobs(); }}
              className="mt-6 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 font-medium text-sm transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobSearch;
