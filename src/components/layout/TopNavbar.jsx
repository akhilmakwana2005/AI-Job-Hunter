import { Search as SearchIcon, Bell, Moon, Sun, Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const TopNavbar = ({ toggleSidebar }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [profilePic, setProfilePic] = useState(localStorage.getItem('profilePic') || null);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    // Check initial theme
    const theme = localStorage.getItem('theme');
    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    // Listen for profile updates
    const handleProfileUpdate = () => {
      setProfilePic(localStorage.getItem('profilePic'));
    };
    window.addEventListener('profile-updated', handleProfileUpdate);
    window.addEventListener('storage', handleProfileUpdate); // For multi-tab support

    return () => {
      window.removeEventListener('profile-updated', handleProfileUpdate);
      window.removeEventListener('storage', handleProfileUpdate);
    };
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);

    const root = window.document.documentElement;
    if (newMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }

    // Dispatch a custom event so Settings page can sync if it's open
    window.dispatchEvent(new Event('theme-changed'));
  };

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 z-30 relative shadow-sm transition-colors duration-300">
      <div className="flex items-center flex-1 max-w-2xl relative z-40 gap-3">
        {toggleSidebar && (
          <button 
            onClick={toggleSidebar} 
            className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            <Menu size={24} />
          </button>
        )}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search jobs, applications, settings..."
            className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl leading-5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
          />
        </div>

        {/* Search Results Dropdown */}
        {isSearchFocused && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsSearchFocused(false)}></div>
            <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl shadow-blue-900/10 border border-slate-200/60 dark:border-slate-700 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              {searchQuery.length === 0 ? (
                <div className="p-4">
                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Recent Searches</h4>
                  <ul className="space-y-1">
                    <li className="px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg cursor-pointer flex items-center gap-2 transition-colors">
                      <SearchIcon className="h-4 w-4 text-slate-400" /> Frontend Developer roles
                    </li>
                    <li className="px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg cursor-pointer flex items-center gap-2 transition-colors">
                      <SearchIcon className="h-4 w-4 text-slate-400" /> Google application status
                    </li>
                    <li className="px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg cursor-pointer flex items-center gap-2 transition-colors">
                      <SearchIcon className="h-4 w-4 text-slate-400" /> Resume tailoring tips
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="p-4">
                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Results for "{searchQuery}"</h4>
                  <ul className="space-y-1">
                    <Link to="/dashboard/jobs" onClick={() => setIsSearchFocused(false)} className="px-3 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg cursor-pointer flex items-center gap-3 transition-colors group">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <SearchIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">Search Jobs: {searchQuery}</p>
                        <p className="text-xs text-slate-500">View job postings</p>
                      </div>
                    </Link>
                    <Link to="/dashboard/applications" onClick={() => setIsSearchFocused(false)} className="px-3 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg cursor-pointer flex items-center gap-3 transition-colors group">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <SearchIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">Filter Applications</p>
                        <p className="text-xs text-slate-500">Find in your active pipeline</p>
                      </div>
                    </Link>
                  </ul>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <div className="flex items-center space-x-4 ml-4">
        <button 
          className="p-2 text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
          onClick={toggleDarkMode}
          title="Toggle theme"
        >
          {isDarkMode ? <Sun size={20} className="text-amber-500" /> : <Moon size={20} />}
        </button>

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900"></span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <>
              {/* Overlay to close when clicking outside */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowNotifications(false)}
              ></div>

              <div className="absolute right-0 mt-4 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl shadow-blue-900/10 dark:shadow-none border border-slate-200/60 dark:border-slate-700 z-50 overflow-hidden transform opacity-100 scale-100 transition-all duration-300">
                <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-wide">Notifications</h3>
                  <span className="text-[10px] font-extrabold tracking-wider bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-full uppercase shadow-sm">3 New</span>
                </div>

                <div className="max-h-[320px] overflow-y-auto scrollbar-hide">
                  <div className="p-5 border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors cursor-pointer group">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500 flex items-center justify-center flex-shrink-0 border border-emerald-100 dark:border-emerald-800/50 shadow-sm group-hover:scale-105 transition-transform">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Resume Score Ready!</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Your resume "Frontend_Dev_2024" scored 85%. Click to view detailed analysis.</p>
                        <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-wider">Just now</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors cursor-pointer group">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center flex-shrink-0 border border-blue-100 dark:border-blue-800/50 shadow-sm group-hover:scale-105 transition-transform">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">New Job Match</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Google just posted a Senior React Developer role matching your skills.</p>
                        <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-wider">2 hours ago</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors cursor-pointer group">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-500 flex items-center justify-center flex-shrink-0 border border-purple-100 dark:border-purple-800/50 shadow-sm group-hover:scale-105 transition-transform">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Mock Interview Feedback</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Your AI interview for 'Full Stack Dev' is complete. Review your answers.</p>
                        <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-wider">Yesterday</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 text-center">
                  <button className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">Mark all as read</button>
                </div>
              </div>
            </>
          )}
        </div>

        <Link to="/dashboard/settings" className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700 ml-2 group">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-bold text-slate-900 dark:text-white leading-none group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center justify-end gap-1.5">
              {user?.fullName || 'Guest User'}
              {user?.isPro && <span className="bg-gradient-to-r from-amber-400 to-amber-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider shadow-sm">Pro</span>}
            </p>
          </div>
          <div className="h-9 w-9 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold text-sm border border-blue-200 dark:border-blue-800 shadow-sm group-hover:ring-2 group-hover:ring-blue-500/50 group-hover:scale-105 transition-all duration-300 overflow-hidden flex-shrink-0">
            {profilePic ? (
              <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              getInitials(user?.fullName)
            )}
          </div>
        </Link>
      </div>
    </header>
  );
};

export default TopNavbar;
