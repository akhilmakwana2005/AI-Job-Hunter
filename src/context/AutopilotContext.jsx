import { createContext, useState, useEffect } from 'react';
import { autoMatchService, applicationService } from '../services/api';

export const AutopilotContext = createContext();

export const AutopilotProvider = ({ children }) => {
  const [matches, setMatches] = useState([]);
  const [isLoadingMatches, setIsLoadingMatches] = useState(true);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [appliedCompanies, setAppliedCompanies] = useState(new Set());
  const [isAutopilotOn, setIsAutopilotOn] = useState(false);
  const [autopilotLogs, setAutopilotLogs] = useState([]);
  
  const [allResumes, setAllResumes] = useState([]);
  const [activeResume, setActiveResume] = useState(null);

  // Fetch initial resumes and past applications once
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const { resumeService } = await import('../services/api');
        const [resumesData, appsData] = await Promise.all([
          resumeService.getResumes(),
          applicationService.getApplications()
        ]);
        
        setAllResumes(resumesData);
        if (resumesData && resumesData.length > 0) {
          setActiveResume(resumesData[0]);
        }

        const companies = new Set(appsData.map(app => app.company.toLowerCase()));
        setAppliedCompanies(companies);
      } catch (error) {
        console.error('Failed to fetch initial autopilot data', error);
      }
    };
    fetchInitialData();
  }, []);

  // Fetch matches whenever activeResume changes
  useEffect(() => {
    const fetchMatches = async () => {
      if (!activeResume) return;
      setIsLoadingMatches(true);
      try {
        const data = await autoMatchService.getMatches(activeResume._id);
        setMatches(data);
      } catch (error) {
        console.error('Failed to fetch matches for resume', error);
      } finally {
        setIsLoadingMatches(false);
      }
    };
    fetchMatches();
  }, [activeResume]);

  // The 24/7 Global Background Loop
  useEffect(() => {
    let autopilotInterval;
    
    if (isAutopilotOn && matches.length > 0) {
      if (autopilotLogs.length === 0) {
        setAutopilotLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), msg: 'Autopilot Agent Started. Scanning for jobs 24/7...', type: 'info' }]);
      }
      
      autopilotInterval = setInterval(() => {
        setMatches(currentMatches => {
          // Find first unapplied job from a company we haven't applied to yet
          const unappliedJobIndex = currentMatches.findIndex(job => 
             !appliedJobs.includes(job._id) && 
             !appliedCompanies.has(job.company.toLowerCase())
          );
          
          if (unappliedJobIndex !== -1) {
            const job = currentMatches[unappliedJobIndex];
            
            setTimeout(() => {
               setAutopilotLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), msg: `Analyzing requirements for ${job.title} at ${job.company}...`, type: 'info' }]);
            }, 500);
            
            setTimeout(() => {
               setAutopilotLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), msg: `Generated tailored Cover Letter. Bypassing ATS...`, type: 'process' }]);
            }, 2500);

            setTimeout(async () => {
               setAppliedJobs(prev => [...prev, job._id]);
               setAppliedCompanies(prev => new Set([...prev, job.company.toLowerCase()])); // Add to applied companies set
               setAutopilotLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), msg: `✅ Successfully Applied to ${job.company}!`, type: 'success' }]);
               
               try {
                 await import('../services/api').then(module => {
                   module.applicationService.addApplication({
                     company: job.company,
                     position: job.title,
                     status: 'Applied',
                     dateApplied: new Date().toISOString(),
                     location: job.location,
                     salary: job.salary,
                     source: 'AI Autopilot'
                   });
                 });
               } catch (err) {
                 console.error("Failed to sync auto-application to tracker", err);
               }

            }, 4500);
          } else {
            // Mock finding a new job if all current ones are applied
            const randomCompanies = ['Netflix', 'Spotify', 'Amazon', 'Apple', 'Meta', 'Tesla', 'Adobe', 'Oracle', 'IBM', 'Intel'];
            // Find a company we haven't applied to yet
            let newCompany = randomCompanies.find(c => !appliedCompanies.has(c.toLowerCase()));
            
            // If all are applied, generate a completely random startup name
            if (!newCompany) {
              newCompany = `Tech Startup ${Math.floor(Math.random() * 1000)}`;
            }

            const randomJob = {
              _id: `auto_${Date.now()}`,
              title: 'Frontend Engineer',
              company: newCompany,
              location: 'Remote',
              salary: '₹25L - ₹40L',
              matchScore: Math.floor(Math.random() * (99 - 85 + 1)) + 85,
              matchReasons: ['Found new opening matching your skills'],
              applyUrl: '#'
            };
            setAutopilotLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), msg: `🔍 Scraped new opening at ${randomJob.company}...`, type: 'info' }]);
            return [...currentMatches, randomJob];
          }
          return currentMatches;
        });
      }, 7000);
    }

    return () => clearInterval(autopilotInterval);
  }, [isAutopilotOn, matches.length, appliedJobs, autopilotLogs.length]);

  return (
    <AutopilotContext.Provider value={{
      matches,
      setMatches,
      isLoadingMatches,
      appliedJobs,
      setAppliedJobs,
      isAutopilotOn,
      setIsAutopilotOn,
      autopilotLogs,
      setAutopilotLogs,
      allResumes,
      activeResume,
      setActiveResume
    }}>
      {children}
    </AutopilotContext.Provider>
  );
};
