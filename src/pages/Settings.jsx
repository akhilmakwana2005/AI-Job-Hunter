import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { User, Mail, Shield, Bell, Save, Briefcase, Trash2, Camera, ExternalLink, Moon, Sun, Monitor } from 'lucide-react';

const Settings = () => {
  const { user } = useSelector((state) => state.auth);
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.name || user?.fullName || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    notificationsEmail: true,
    notificationsPush: false,
    theme: localStorage.getItem('theme') || 'system'
  });
  const [profileImage, setProfileImage] = useState(localStorage.getItem('profilePic') || null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit for local storage compatibility
        alert("Please select an image smaller than 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;
        setProfileImage(base64Image);
        try {
          localStorage.setItem('profilePic', base64Image);
          window.dispatchEvent(new Event('profile-updated'));
        } catch (err) {
          console.error("Failed to save profile pic to local storage", err);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    if(fileInputRef.current) fileInputRef.current.value = '';
    localStorage.removeItem('profilePic');
    window.dispatchEvent(new Event('profile-updated'));
  };

  // Apply Theme Logic
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (formData.theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(formData.theme);
    }

    localStorage.setItem('theme', formData.theme);
  }, [formData.theme]);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || user.fullName || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API Call
    setTimeout(() => {
      setIsSaving(false);
      // Optional toast notification would go here
    }, 1500);
  };

  const tabs = [
    { id: 'profile', label: 'Public Profile', icon: User, desc: 'Your personal info' },
    { id: 'preferences', label: 'Preferences', icon: Briefcase, desc: 'App settings & theme' },
    { id: 'security', label: 'Security', icon: Shield, desc: 'Passwords & auth' },
    { id: 'notifications', label: 'Notifications', icon: Bell, desc: 'Email alerts' }
  ];

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col lg:flex-row gap-8 pb-10">
      
      {/* Sidebar Navigation */}
      <div className="w-full lg:w-72 flex-shrink-0 space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight transition-colors">Settings</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 transition-colors">Manage your account and preferences.</p>
        </div>

        <nav className="flex flex-row lg:flex-col gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`snap-start flex-shrink-0 w-auto lg:w-full flex items-center gap-3 lg:gap-4 px-4 py-2.5 lg:py-3.5 rounded-xl transition-all duration-300 text-left ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-none lg:translate-x-1' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-blue-600 dark:hover:text-blue-400 lg:hover:translate-x-1'
                }`}
              >
                <div className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'}`}>
                  <Icon size={18} className={isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'} />
                </div>
                <div>
                  <p className={`text-sm font-bold transition-colors ${isActive ? 'text-white' : 'text-slate-900 dark:text-slate-200'}`}>{tab.label}</p>
                  <p className={`text-xs transition-colors ${isActive ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'} hidden sm:block lg:block`}>{tab.desc}</p>
                </div>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-slate-100 dark:border-slate-800 overflow-hidden relative min-h-[600px] transition-colors duration-300">
          
          {/* Decorative Background Blur */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-blue-50 dark:bg-blue-900/20 blur-3xl opacity-60 pointer-events-none transition-colors"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-cyan-50 dark:bg-cyan-900/20 blur-3xl opacity-60 pointer-events-none transition-colors"></div>

          <form onSubmit={handleSave} className="p-8 relative z-10 h-full flex flex-col">
            
            <div className="flex-1">
              {/* PROFILE TAB */}
              {activeTab === 'profile' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1 transition-colors">Profile Information</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors">Update your photo and personal details here.</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-6 p-6 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50 transition-colors">
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleImageChange} 
                      accept="image/*" 
                      className="hidden" 
                    />
                    <div className="relative flex-shrink-0 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-blue-200 dark:shadow-none overflow-hidden">
                        {profileImage ? (
                          <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          user?.fullName?.charAt(0) || 'U'
                        )}
                      </div>
                      <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="text-white" size={24} />
                      </div>
                    </div>
                    <div className="flex-1 w-full flex flex-col items-center sm:items-start">
                      <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-1 transition-colors">{formData.fullName || 'User'}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-5 transition-colors break-all">{formData.email}</p>
                      <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full sm:w-auto px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors shadow-sm">
                          Change Photo
                        </button>
                        <button type="button" onClick={handleRemoveImage} className="w-full sm:w-auto px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg text-sm font-bold hover:bg-red-700 dark:hover:bg-red-800 transition-colors shadow-sm">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300 transition-colors">Full Name</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <User className="h-4 w-4 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors" />
                        </div>
                        <input 
                          type="text" 
                          className="pl-10 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 px-4 py-3 text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                          value={formData.fullName}
                          onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300 transition-colors">Email Address</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Mail className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                        </div>
                        <input 
                          type="email" 
                          className="pl-10 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-4 py-3 text-sm text-slate-500 dark:text-slate-400 cursor-not-allowed transition-colors"
                          value={formData.email}
                          readOnly
                        />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors">Contact support to change your email.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* PREFERENCES TAB */}
              {activeTab === 'preferences' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1 transition-colors">App Preferences</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors">Customize your workspace and theme.</p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider transition-colors">Appearance</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, theme: 'light'})}
                        className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${formData.theme === 'light' ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20' : 'border-slate-100 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500'}`}
                      >
                        <Sun size={24} className={formData.theme === 'light' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'} />
                        <span className={`text-sm font-bold transition-colors ${formData.theme === 'light' ? 'text-blue-900 dark:text-blue-300' : 'text-slate-600 dark:text-slate-400'}`}>Light</span>
                      </button>
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, theme: 'dark'})}
                        className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${formData.theme === 'dark' ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20' : 'border-slate-100 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500'}`}
                      >
                        <Moon size={24} className={formData.theme === 'dark' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'} />
                        <span className={`text-sm font-bold transition-colors ${formData.theme === 'dark' ? 'text-blue-900 dark:text-blue-300' : 'text-slate-600 dark:text-slate-400'}`}>Dark</span>
                      </button>
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, theme: 'system'})}
                        className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${formData.theme === 'system' ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20' : 'border-slate-100 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500'}`}
                      >
                        <Monitor size={24} className={formData.theme === 'system' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'} />
                        <span className={`text-sm font-bold transition-colors ${formData.theme === 'system' ? 'text-blue-900 dark:text-blue-300' : 'text-slate-600 dark:text-slate-400'}`}>System</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* SECURITY TAB */}
              {activeTab === 'security' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1 transition-colors">Security Settings</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors">Manage your password and active sessions.</p>
                  </div>
                  
                  <div className="max-w-md space-y-5 bg-slate-50/50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/50 transition-colors">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300 transition-colors">Current Password</label>
                      <input 
                        type="password" 
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        value={formData.currentPassword}
                        onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300 transition-colors">New Password</label>
                      <input 
                        type="password" 
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        value={formData.newPassword}
                        onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800 pt-8 mt-8 transition-colors">
                    <h3 className="text-red-600 dark:text-red-400 font-bold mb-2 transition-colors">Danger Zone</h3>
                    <div className="flex items-center justify-between p-4 border border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10 rounded-xl transition-colors">
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white transition-colors">Delete Account</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors">Permanently delete your account and data.</p>
                      </div>
                      <button type="button" className="px-4 py-2 bg-red-600 dark:bg-red-700 text-white text-sm font-bold rounded-lg hover:bg-red-700 dark:hover:bg-red-800 transition-colors shadow-sm border border-transparent">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* NOTIFICATIONS TAB */}
              {activeTab === 'notifications' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1 transition-colors">Notification Preferences</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors">Control when and how you are notified.</p>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Email Toggle */}
                    <label className="flex items-start justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                      <div>
                        <span className="block text-sm font-bold text-slate-900 dark:text-white transition-colors">Email Alerts</span>
                        <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[250px] transition-colors">Receive daily job matches and AI analysis reports via email.</span>
                      </div>
                      <div className="relative inline-flex items-center">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={formData.notificationsEmail}
                          onChange={(e) => setFormData({...formData, notificationsEmail: e.target.checked})}
                        />
                        <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 transition-colors"></div>
                      </div>
                    </label>

                    {/* Push Toggle */}
                    <label className="flex items-start justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                      <div>
                        <span className="block text-sm font-bold text-slate-900 dark:text-white transition-colors">Push Notifications</span>
                        <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[250px] transition-colors">Get notified immediately when an employer views your application.</span>
                      </div>
                      <div className="relative inline-flex items-center">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={formData.notificationsPush}
                          onChange={(e) => setFormData({...formData, notificationsPush: e.target.checked})}
                        />
                        <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 transition-colors"></div>
                      </div>
                    </label>
                  </div>
                </div>
              )}
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
