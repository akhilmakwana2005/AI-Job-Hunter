import { useState, useEffect } from 'react';
import { Plus, MoreVertical, MapPin, IndianRupee, Calendar, GripVertical, Trash2 } from 'lucide-react';
import { applicationService } from '../services/api';

const COLUMNS = ['Saved', 'Applied', 'Interviewing', 'Offered', 'Rejected'];

const ApplicationsTracker = () => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // New App Form State
  const [newApp, setNewApp] = useState({ company: '', position: '', location: '', salary: '', status: 'Applied' });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const data = await applicationService.getApplications();
      setApplications(data);
    } catch (error) {
      console.error('Failed to fetch applications', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragStart = (e, appId) => {
    e.dataTransfer.setData('appId', appId);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    const appId = e.dataTransfer.getData('appId');
    
    // Optimistic update
    setApplications(prev => prev.map(app => 
      app._id === appId ? { ...app, status: newStatus } : app
    ));

    // API Call
    try {
      await applicationService.updateApplication(appId, { status: newStatus });
    } catch (error) {
      console.error('Failed to update status', error);
      fetchApplications(); // Revert on failure
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newApp.company || !newApp.position) return;
    
    try {
      const addedApp = await applicationService.addApplication(newApp);
      setApplications([addedApp, ...applications]);
      setShowAddModal(false);
      setNewApp({ company: '', position: '', location: '', salary: '', status: 'Applied' });
    } catch (error) {
      console.error('Failed to add application', error);
    }
  };

  const handleDelete = async (appId) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await applicationService.deleteApplication(appId);
        setApplications(applications.filter(app => app._id !== appId));
      } catch (error) {
        console.error('Failed to delete application', error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Saved': return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'Applied': return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Interviewing': return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'Offered': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Rejected': return 'bg-rose-50 text-rose-800 border-rose-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Applications Board</h1>
          <p className="text-slate-500 text-sm">Drag and drop to update application status.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
        >
          <Plus size={16} className="mr-2" /> Add Application
        </button>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="flex-1 overflow-x-auto pb-4 scrollbar-hide">
          <div className="flex gap-6 min-w-max h-full">
            {COLUMNS.map(column => (
              <div 
                key={column} 
                className="w-80 flex flex-col bg-slate-50/50 border border-slate-200 rounded-xl"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column)}
              >
                <div className={`p-4 border-b border-slate-200 rounded-t-xl ${getStatusColor(column)} bg-opacity-50`}>
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold">{column}</h3>
                    <span className="bg-white px-2 py-0.5 rounded-full text-xs font-bold shadow-sm">
                      {applications.filter(a => a.status === column).length}
                    </span>
                  </div>
                </div>

                <div className="flex-1 p-3 overflow-y-auto space-y-3 min-h-[150px] scrollbar-hide">
                  {applications.filter(app => app.status === column).map(app => (
                    <div 
                      key={app._id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, app._id)}
                      className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 cursor-grab active:cursor-grabbing hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 group relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute top-4 right-2 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                        <GripVertical size={16} />
                      </div>
                      
                      <h4 className="font-bold text-slate-900 pr-6">{app.position}</h4>
                      <p className="text-sm font-medium text-slate-600 mb-2">{app.company}</p>
                      
                      {app.source && app.source !== 'Manual' && (
                        <div className="mb-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            app.source === 'AI Autopilot' 
                              ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 text-white shadow-sm' 
                              : 'bg-blue-100 text-blue-700 border border-blue-200'
                          }`}>
                            {app.source === 'AI Autopilot' && <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>}
                            {app.source}
                          </span>
                        </div>
                      )}
                      
                      <div className="space-y-1.5 mb-4">
                        {app.location && (
                          <div className="flex items-center text-xs text-slate-500">
                            <MapPin size={14} className="mr-1.5" /> {app.location}
                          </div>
                        )}
                        {app.salary && (
                          <div className="flex items-center text-xs text-slate-500">
                            <IndianRupee size={14} className="mr-1.5" /> {app.salary}
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                        <div className="flex items-center text-xs text-slate-400 font-medium">
                          <Calendar size={12} className="mr-1" />
                          {new Date(app.dateApplied).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </div>
                        <button 
                          onClick={() => handleDelete(app._id)}
                          className="text-slate-400 hover:text-rose-600 transition-colors"
                          title="Delete Application"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">Add Application</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                &times;
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company *</label>
                <input 
                  required type="text" className="w-full rounded-md border border-slate-300 px-3 py-2 focus:ring-1 focus:ring-indigo-500" 
                  value={newApp.company} onChange={e => setNewApp({...newApp, company: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Position *</label>
                <input 
                  required type="text" className="w-full rounded-md border border-slate-300 px-3 py-2 focus:ring-1 focus:ring-indigo-500" 
                  value={newApp.position} onChange={e => setNewApp({...newApp, position: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                  <input 
                    type="text" className="w-full rounded-md border border-slate-300 px-3 py-2 focus:ring-1 focus:ring-indigo-500" 
                    value={newApp.location} onChange={e => setNewApp({...newApp, location: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select 
                    className="w-full rounded-md border border-slate-300 px-3 py-2 focus:ring-1 focus:ring-indigo-500"
                    value={newApp.status} onChange={e => setNewApp({...newApp, status: e.target.value})}
                  >
                    {COLUMNS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700">
                  Save Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsTracker;
