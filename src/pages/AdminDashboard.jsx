import { useState, useEffect } from 'react';
import { Users, Crown, CreditCard, Activity, FileText, Briefcase, ChevronRight } from 'lucide-react';
import { adminService } from '../services/api';

const AdminDashboard = () => {
  const [data, setData] = useState({ stats: null, recentUsers: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const result = await adminService.getStats();
      setData(result);
    } catch (error) {
      console.error('Failed to fetch admin stats', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const { stats, recentUsers } = data;

  const statCards = [
    { title: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { title: 'Pro Members', value: stats?.proUsers || 0, icon: Crown, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30' },
    { title: 'Monthly Revenue', value: `₹${stats?.revenue || 0}`, icon: CreditCard, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
    { title: 'Resumes Scanned', value: stats?.totalResumesScanned || 0, icon: FileText, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' },
    { title: 'Jobs Applied', value: stats?.totalApplications || 0, icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
    { title: 'Negotiations Done', value: stats?.totalNegotiations || 0, icon: Activity, color: 'text-rose-600', bg: 'bg-rose-100 dark:bg-rose-900/30' }
  ];

  const handlePromote = async (userId) => {
    try {
      await adminService.promoteUser(userId);
      // Update local state to reflect change immediately
      setData(prev => ({
        ...prev,
        recentUsers: prev.recentUsers.map(u => 
          u._id === userId ? { ...u, isPro: true } : u
        ),
        stats: {
          ...prev.stats,
          proUsers: prev.stats.proUsers + 1,
          revenue: prev.stats.revenue + 499
        }
      }));
    } catch (error) {
      console.error('Failed to promote user', error);
      alert('Failed to promote user');
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Admin Overview</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Monitor your SaaS platform's performance and revenue.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow cursor-default">
            <div className={`w-14 h-14 rounded-full ${card.bg} ${card.color} flex items-center justify-center flex-shrink-0`}>
              <card.icon size={28} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{card.title}</p>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Users Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Registrations</h2>
          <button className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center">
            View All <ChevronRight size={16} />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900 text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Plan</th>
                <th className="px-6 py-4">Joined At</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {recentUsers.map((u, i) => (
                <tr key={u._id || i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs uppercase">
                        {u.fullName.substring(0, 2)}
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{u.fullName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 font-medium">{u.email}</td>
                  <td className="px-6 py-4">
                    {u.isPro ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50">
                        <Crown size={12} /> PRO
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                        FREE
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 font-medium">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    {!u.isPro && (
                      <button 
                        onClick={() => handlePromote(u._id)}
                        className="text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-md transition-colors"
                      >
                        Make Pro
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {recentUsers.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
