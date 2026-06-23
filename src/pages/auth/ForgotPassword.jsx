import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { KeyRound, ArrowRight, CheckCircle, Sparkles, ArrowLeft } from 'lucide-react';
import { authService } from '../../services/api';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const ForgotPassword = () => {
  const [status, setStatus] = useState({ type: '', message: '' });
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    setStatus({ type: '', message: '' });
    try {
      await authService.forgotPassword(data.email);
      setStatus({ 
        type: 'success', 
        message: "If an account exists for that email, we've sent password reset instructions." 
      });
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: error.response?.data?.message || 'Something went wrong. Please try again later.' 
      });
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      
      {/* Left Side - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-5/12 bg-slate-950 relative overflow-hidden flex-col justify-between p-12 text-white">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.2)_0%,rgba(15,23,42,1)_100%)] pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="AI Job Hunter Logo" className="w-8 h-8 object-contain" />
          <span className="font-extrabold text-xl tracking-tight">Job Hunter</span>
        </div>

        <div className="relative z-10 mt-auto mb-10">
          <div className="inline-flex items-center px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-bold mb-6 border border-blue-500/20">
            <Sparkles className="w-3 h-3 mr-1.5" /> Secure Recovery
          </div>
          <h1 className="text-4xl font-extrabold leading-tight mb-6">
            Don't let a lost password stop your career.
          </h1>
          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-slate-300 font-medium">
              <CheckCircle className="text-blue-400 w-5 h-5" /> Fast and secure account recovery.
            </li>
            <li className="flex items-center gap-3 text-slate-300 font-medium">
              <CheckCircle className="text-blue-400 w-5 h-5" /> Keep your saved jobs and resumes safe.
            </li>
          </ul>
        </div>
        
        <div className="relative z-10 text-slate-500 text-sm font-medium">
          © 2026 AI Job Hunter. All rights reserved.
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-12 lg:p-16 bg-slate-50 lg:bg-white relative">
        <div className="w-full max-w-md bg-white lg:bg-transparent p-6 sm:p-10 lg:p-0 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] lg:shadow-none border border-slate-100 lg:border-transparent space-y-8 relative z-10">
          
          <div className="lg:hidden flex items-center gap-3 justify-center mb-2">
            <img src="/logo.png" alt="AI Job Hunter Logo" className="w-10 h-10 object-contain" />
            <span className="font-extrabold text-2xl tracking-tight text-slate-900">Job Hunter</span>
          </div>

          <div className="text-center lg:text-left">
            <Link to="/login" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors mb-6 group justify-center lg:justify-start w-full lg:w-auto">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to log in
            </Link>
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto lg:mx-0 mb-6">
              <KeyRound className="w-7 h-7 text-blue-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Forgot password?
            </h2>
            <p className="mt-2 text-sm text-slate-500 font-medium leading-relaxed">
              No worries, we'll send you reset instructions. Please enter the email address associated with your account.
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {status.message && (
              <div className={`border rounded-xl p-4 flex items-start gap-3 ${status.type === 'error' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${status.type === 'error' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                  {status.type === 'error' ? <span className="text-xs font-bold">!</span> : <CheckCircle className="w-3 h-3" />}
                </div>
                <p className={`text-sm font-medium ${status.type === 'error' ? 'text-red-800' : 'text-green-800'}`}>
                  {status.message}
                </p>
              </div>
            )}
            
            <div className="space-y-5">
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
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || status.type === 'success'}
                className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-extrabold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5"
              >
                {isSubmitting ? 'Sending instructions...' : (
                  <span className="flex items-center gap-2">
                    Send Reset Link <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
