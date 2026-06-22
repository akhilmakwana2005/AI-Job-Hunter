import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileText, ArrowRight } from 'lucide-react';

const OnboardingStep1 = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleNext = () => {
    if (!file) return;
    setIsUploading(true);
    // Simulate AI parsing upload
    setTimeout(() => {
      setIsUploading(false);
      navigate('/onboarding/step-2');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full mx-auto space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-slate-100">
        
        <div className="text-center">
          <div className="flex justify-center mb-4 space-x-2">
            <div className="h-2 w-12 bg-indigo-600 rounded-full"></div>
            <div className="h-2 w-12 bg-slate-200 rounded-full"></div>
            <div className="h-2 w-12 bg-slate-200 rounded-full"></div>
            <div className="h-2 w-12 bg-slate-200 rounded-full"></div>
            <div className="h-2 w-12 bg-slate-200 rounded-full"></div>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">Upload your Resume</h2>
          <p className="mt-2 text-slate-600">Our AI will automatically extract your skills and experience to set up your profile.</p>
        </div>

        <div className="mt-8">
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
            <input 
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />
            {file ? (
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
                  <FileText size={32} />
                </div>
                <p className="text-lg font-medium text-slate-900">{file.name}</p>
                <p className="text-sm text-slate-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                <p className="text-indigo-600 mt-4 font-medium">Click to replace</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <UploadCloud size={48} className="text-slate-400 mb-4" />
                <p className="text-lg font-medium text-slate-900">Drag and drop your resume</p>
                <p className="text-slate-500 mt-2">or click to browse files (PDF, DOCX)</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-between items-center">
          <button onClick={() => navigate('/onboarding/step-2')} className="text-slate-500 font-medium hover:text-slate-700">Skip for now</button>
          <button 
            onClick={handleNext}
            disabled={!file || isUploading}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Analyzing Resume...' : 'Continue'}
            {!isUploading && <ArrowRight size={18} />}
          </button>
        </div>

      </div>
    </div>
  );
};

export default OnboardingStep1;
