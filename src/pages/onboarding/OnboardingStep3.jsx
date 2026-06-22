import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowRight, ArrowLeft, Briefcase, MapPin, DollarSign } from 'lucide-react';
import { updateUser } from '../../store/authSlice';
import { userService } from '../../services/api';

const OnboardingStep3 = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const [formData, setFormData] = useState({
    experienceLevel: 'Mid-Level',
    roles: 'Frontend Developer, Full Stack Engineer',
    locations: 'Remote, New York',
    minSalary: '120000',
    workType: 'remote'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    setApiError('');
    try {
      const payload = {
        onboardingCompleted: true,
        preferences: {
          roles: formData.roles.split(',').map(r => r.trim()),
          locations: formData.locations.split(',').map(l => l.trim()),
          minSalary: parseInt(formData.minSalary),
          workType: formData.workType
        },
        profile: {
          experienceLevel: formData.experienceLevel
        }
      };

      await userService.updatePreferences(payload);
      
      dispatch(updateUser({ onboardingCompleted: true }));
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to complete onboarding', error);
      setApiError(error.response?.data?.message || 'Failed to save preferences');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full mx-auto space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-slate-100">
        
        <div className="text-center">
          <div className="flex justify-center mb-4 space-x-2">
            <div className="h-2 w-12 bg-indigo-600 rounded-full"></div>
            <div className="h-2 w-12 bg-indigo-600 rounded-full"></div>
            <div className="h-2 w-12 bg-indigo-600 rounded-full"></div>
            <div className="h-2 w-12 bg-indigo-600 rounded-full"></div>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">Job Preferences</h2>
          <p className="mt-2 text-slate-600">Tell us what kind of job you're looking for to get accurate matches.</p>
        </div>

        {apiError && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <p className="text-sm text-red-700">{apiError}</p>
          </div>
        )}

        <div className="mt-8 space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Experience Level</label>
            <select 
              name="experienceLevel"
              value={formData.experienceLevel}
              onChange={handleChange}
              className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="Entry-Level">Entry-Level (0-2 years)</option>
              <option value="Mid-Level">Mid-Level (3-5 years)</option>
              <option value="Senior">Senior (5-8 years)</option>
              <option value="Lead/Manager">Lead / Manager (8+ years)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Job Roles</label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Briefcase className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                name="roles"
                value={formData.roles}
                onChange={handleChange}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-md py-2 border"
                placeholder="e.g. Frontend Developer, Product Designer"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Minimum Salary (USD)</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="number"
                  name="minSalary"
                  value={formData.minSalary}
                  onChange={handleChange}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-md py-2 border"
                  placeholder="100000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Work Type</label>
              <select 
                name="workType"
                value={formData.workType}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="onsite">On-Site</option>
                <option value="any">Any</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Locations</label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                name="locations"
                value={formData.locations}
                onChange={handleChange}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-md py-2 border"
                placeholder="e.g. San Francisco, Remote, London"
              />
            </div>
          </div>

        </div>

        <div className="mt-12 flex justify-between items-center pt-6 border-t border-slate-100">
          <button 
            onClick={() => navigate('/onboarding/step-2')}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 font-medium hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={18} /> Back
          </button>
          <button 
            onClick={handleFinish}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Finalizing Setup...' : 'Complete Setup'} 
            {!isSubmitting && <ArrowRight size={18} />}
          </button>
        </div>

      </div>
    </div>
  );
};

export default OnboardingStep3;
