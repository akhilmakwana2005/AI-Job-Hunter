import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess } from '../../store/authSlice';
import { authService } from '../../services/api';
import { UserPlus, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [apiError, setApiError] = useState('');
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    dispatch(loginStart());
    setApiError('');
    try {
      const response = await authService.register(data);
      
      const token = response.token;
      const user = { 
        id: response._id, 
        name: response.fullName, 
        email: response.email,
        onboardingCompleted: false
      };
      
      dispatch(loginSuccess({ user, token }));
      
      // Navigate to onboarding
      navigate('/onboarding/step-1');
    } catch (error) {
      setApiError(error.response?.data?.message || 'Registration failed. Please try again.');
      dispatch({ type: 'auth/loginFailure', payload: error.response?.data?.message });
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      
      {/* Left Side - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-5/12 bg-slate-950 relative overflow-hidden flex-col justify-between p-12 text-white">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.2)_0%,rgba(15,23,42,1)_100%)] pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center font-extrabold text-sm shadow-lg shadow-blue-500/30">AI</div>
          <span className="font-extrabold text-xl tracking-tight">Job Hunter</span>
        </div>

        <div className="relative z-10 mt-auto mb-10">
          <div className="inline-flex items-center px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-bold mb-6 border border-blue-500/20">
            <Sparkles className="w-3 h-3 mr-1.5" /> Join 10,000+ Job Seekers
          </div>
          <h1 className="text-4xl font-extrabold leading-tight mb-6">
            The unfair advantage in your job search.
          </h1>
          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-slate-300 font-medium">
              <CheckCircle className="text-blue-400 w-5 h-5" /> Beat the ATS with AI tailored resumes.
            </li>
            <li className="flex items-center gap-3 text-slate-300 font-medium">
              <CheckCircle className="text-blue-400 w-5 h-5" /> Generate custom cover letters instantly.
            </li>
            <li className="flex items-center gap-3 text-slate-300 font-medium">
              <CheckCircle className="text-blue-400 w-5 h-5" /> Practice interviews with realistic AI voices.
            </li>
          </ul>
        </div>
        
        <div className="relative z-10 text-slate-500 text-sm font-medium">
          © 2026 AI Job Hunter. All rights reserved.
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-slate-50 lg:bg-white relative">
        <div className="w-full max-w-md space-y-8 relative z-10">
          
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 justify-center mb-10">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-xl flex items-center justify-center font-extrabold text-sm shadow-md">AI</div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">Job Hunter</span>
          </div>

          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Create your account
            </h2>
            <p className="mt-3 text-sm text-slate-500 font-medium">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-blue-600 hover:text-blue-700 transition-colors">
                Sign in instead
              </Link>
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {apiError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-red-600 text-xs font-bold">!</span>
                </div>
                <p className="text-sm text-red-800 font-medium">{apiError}</p>
              </div>
            )}
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  type="text"
                  className={`appearance-none block w-full px-4 py-3.5 border ${errors.fullName ? 'border-red-300 ring-1 ring-red-300' : 'border-slate-200'} bg-slate-50 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all sm:text-sm font-medium`}
                  placeholder="e.g. John Doe"
                  {...register('fullName')}
                />
                {errors.fullName && <p className="mt-2 text-sm text-red-600 font-medium">{errors.fullName.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  className={`appearance-none block w-full px-4 py-3.5 border ${errors.email ? 'border-red-300 ring-1 ring-red-300' : 'border-slate-200'} bg-slate-50 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all sm:text-sm font-medium`}
                  placeholder="you@company.com"
                  {...register('email')}
                />
                {errors.email && <p className="mt-2 text-sm text-red-600 font-medium">{errors.email.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  className={`appearance-none block w-full px-4 py-3.5 border ${errors.password ? 'border-red-300 ring-1 ring-red-300' : 'border-slate-200'} bg-slate-50 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all sm:text-sm font-medium`}
                  placeholder="At least 8 characters"
                  {...register('password')}
                />
                {errors.password && <p className="mt-2 text-sm text-red-600 font-medium">{errors.password.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  className={`appearance-none block w-full px-4 py-3.5 border ${errors.confirmPassword ? 'border-red-300 ring-1 ring-red-300' : 'border-slate-200'} bg-slate-50 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all sm:text-sm font-medium`}
                  placeholder="Repeat your password"
                  {...register('confirmPassword')}
                />
                {errors.confirmPassword && <p className="mt-2 text-sm text-red-600 font-medium">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-extrabold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5"
              >
                {isSubmitting ? 'Creating account...' : (
                  <span className="flex items-center gap-2">
                    Create Account <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </button>
            </div>
            
            <p className="text-xs text-center text-slate-500 font-medium mt-6">
              By creating an account, you agree to our <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
