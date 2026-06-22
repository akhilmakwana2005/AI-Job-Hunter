import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight, ArrowLeft } from 'lucide-react';

const COMMON_SKILLS = [
  'JavaScript', 'React', 'Node.js', 'Python', 'TypeScript', 'Tailwind CSS',
  'AWS', 'Docker', 'MongoDB', 'PostgreSQL', 'GraphQL', 'Next.js',
  'UI/UX Design', 'Figma', 'Agile', 'System Design'
];

const OnboardingStep2 = () => {
  const navigate = useNavigate();
  const [selectedSkills, setSelectedSkills] = useState(['React', 'JavaScript', 'Tailwind CSS']);
  const [customSkill, setCustomSkill] = useState('');

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleAddCustomSkill = (e) => {
    if (e.key === 'Enter' && customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      e.preventDefault();
      setSelectedSkills([...selectedSkills, customSkill.trim()]);
      setCustomSkill('');
    }
  };

  const handleNext = () => {
    // Save to Redux or Context here
    navigate('/onboarding/step-3');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full mx-auto space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-slate-100">
        
        <div className="text-center">
          <div className="flex justify-center mb-4 space-x-2">
            <div className="h-2 w-12 bg-indigo-600 rounded-full"></div>
            <div className="h-2 w-12 bg-indigo-600 rounded-full"></div>
            <div className="h-2 w-12 bg-slate-200 rounded-full"></div>
            <div className="h-2 w-12 bg-slate-200 rounded-full"></div>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">Verify Your Skills</h2>
          <p className="mt-2 text-slate-600">Our AI extracted these skills from your resume. Add or remove as needed.</p>
        </div>

        <div className="mt-8">
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">Add a skill</label>
            <input
              type="text"
              className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g. Kubernetes (Press Enter to add)"
              value={customSkill}
              onChange={(e) => setCustomSkill(e.target.value)}
              onKeyDown={handleAddCustomSkill}
            />
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {selectedSkills.map(skill => (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 border border-indigo-200 hover:bg-indigo-200 transition-colors"
              >
                <Check size={14} className="mr-1.5" />
                {skill}
              </button>
            ))}
          </div>

          <div className="mt-8">
            <p className="text-sm font-medium text-slate-700 mb-3">Suggested Skills</p>
            <div className="flex flex-wrap gap-2">
              {COMMON_SKILLS.filter(s => !selectedSkills.includes(s)).map(skill => (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-white text-slate-700 border border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-colors"
                >
                  + {skill}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-between items-center pt-6 border-t border-slate-100">
          <button 
            onClick={() => navigate('/onboarding/step-1')}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 font-medium hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={18} /> Back
          </button>
          <button 
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Continue <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default OnboardingStep2;
