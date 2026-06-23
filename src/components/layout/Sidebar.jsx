import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice';
import { 
  LayoutDashboard, 
  Search, 
  Sparkles, 
  FileText, 
  PenTool, 
  MessageSquare, 
  TrendingUp, 
  Briefcase, 
  UserCircle, 
  Settings,
  ChevronRight,
  LogOut,
  Users,
  IndianRupee,
  Globe,
  Zap
} from 'lucide-react';

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(logout());
    navigate('/');
  };
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Job Search', path: '/dashboard/jobs', icon: Search },
    { name: '1-Click Apply Queue', path: '/dashboard/auto-match', icon: Zap, isNew: true },
    { name: 'AI Recommendations', path: '/dashboard/recommendations', icon: Sparkles },
    { name: 'Portfolio Builder', path: '/dashboard/portfolio', icon: Globe },
    { name: 'Resume Analyzer', path: '/dashboard/resume', icon: FileText },
    { name: 'Cover Letters', path: '/dashboard/cover-letters', icon: PenTool },
    { name: 'Salary Negotiation', path: '/dashboard/salary-negotiation', icon: IndianRupee },
    { name: 'Mock Interview', path: '/dashboard/mock-interview', icon: MessageSquare },
    { name: 'Skill Gap', path: '/dashboard/skills', icon: TrendingUp },
    { name: 'Applications', path: '/dashboard/applications', icon: Briefcase },
    { name: 'LinkedIn Analyzer', path: '/dashboard/linkedin', icon: UserCircle },
    { name: 'Networking AI', path: '/dashboard/networking', icon: Users },
  ];

  return (
    <aside className="w-64 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200/60 dark:border-slate-800/60 flex flex-col h-full shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.2)] z-20 transition-all duration-300">
      
      {/* Brand Logo Area */}
      <div className="h-20 flex items-center px-6 border-b border-slate-200/50 dark:border-slate-800/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-900/10 opacity-50"></div>
        <div className="relative flex items-center w-full">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-xl flex items-center justify-center font-extrabold text-sm mr-3 shadow-lg shadow-blue-500/30 transform hover:scale-105 transition-transform duration-300">
            AI
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
            Job Hunter
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 scrollbar-hide">
        
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/dashboard'}
              className={({ isActive }) => 
                `group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-500/10 dark:to-blue-600/5 text-blue-700 dark:text-blue-400 shadow-sm ring-1 ring-blue-100 dark:ring-blue-500/20' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center">
                    <Icon className={`mr-3 h-5 w-5 flex-shrink-0 transition-transform duration-300 ${isActive ? 'scale-110 text-blue-600 dark:text-blue-400' : 'group-hover:scale-110 group-hover:text-blue-500 dark:group-hover:text-blue-400'}`} />
                    <span className="transform transition-transform duration-300 group-hover:translate-x-1">{item.name}</span>
                  </div>
                  {item.isNew && (
                    <span className="ml-2 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-sm">
                      New
                    </span>
                  )}
                  {isActive && (
                    <div className="w-1.5 h-5 rounded-full bg-blue-600 dark:bg-blue-500 shadow-[0_0_8px_rgba(37,99,235,0.6)] ml-auto"></div>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Area with Upgrade & Settings */}
      <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50 space-y-3 bg-slate-50/30 dark:bg-slate-900/30">
        
        {/* Premium Upgrade Card (Hide if Pro) */}
        {!user?.isPro && (
          <div className="relative overflow-hidden rounded-2xl p-4 border border-blue-100/50 dark:border-blue-500/20 group cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-white dark:from-blue-900/20 dark:via-cyan-900/10 dark:to-slate-900 opacity-90 transition-opacity duration-300 group-hover:opacity-100"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h4 className="text-xs font-extrabold text-blue-950 dark:text-blue-200 uppercase tracking-wide">Pro Plan</h4>
              </div>
              <p className="text-[11px] font-medium text-blue-800/80 dark:text-blue-300/80 mb-3 leading-tight">Unlock infinite AI interviews & magic cover letters.</p>
              <NavLink to="/dashboard/upgrade" className="flex items-center justify-center w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-xs font-bold py-2.5 rounded-xl transition-all duration-300 shadow-md shadow-blue-500/20 hover:shadow-blue-500/40 transform hover:-translate-y-0.5">
                Upgrade Now <ChevronRight className="w-3 h-3 ml-1" />
              </NavLink>
            </div>
          </div>
        )}
        
        {/* Settings Link */}
        <NavLink
          to="/dashboard/settings"
          className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white font-medium'}`}
        >
          <Settings size={20} className="text-slate-400 dark:text-slate-500" />
          <span className="text-sm">Settings</span>
        </NavLink>

        {user?.isAdmin && (
          <NavLink
            to="/dashboard/admin"
            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white font-medium'}`}
          >
            <LayoutDashboard size={20} className="text-slate-400 dark:text-slate-500" />
            <span className="text-sm">Admin Panel</span>
          </NavLink>
        )}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full group flex items-center px-3 py-3 rounded-xl text-sm font-semibold transition-all duration-300 text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
        >
          <LogOut className="mr-3 h-5 w-5 flex-shrink-0 transition-transform duration-300 group-hover:-translate-x-1 group-hover:text-red-500" />
          <span className="transition-transform duration-300 group-hover:translate-x-1">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
