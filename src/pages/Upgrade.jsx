import { CheckCircle, Zap, Crown, Check, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { paymentService } from '../services/api';
import { updateUser } from '../store/authSlice';

const Upgrade = () => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate Razorpay Gateway Delay
    setTimeout(async () => {
      try {
        const fakePaymentId = 'pay_' + Math.random().toString(36).substring(2, 15);
        const data = await paymentService.upgradeToPro({ paymentId: fakePaymentId, amount: 499 });
        
        // Update Redux state
        dispatch(updateUser({ isPro: true, subscription: data.subscription }));
        alert('Payment Successful! Welcome to Pro.');
      } catch (error) {
        console.error('Payment failed', error);
        alert('Payment failed. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    }, 2000); // 2 seconds fake processing
  };
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">Supercharge Your Job Search</h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">Stop applying into the void. Get unlimited access to AI Auto-Tailoring, Voice Mock Interviews, and priority alerts to land your dream job 10x faster.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
        {/* Free Plan */}
        <div className="bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 md:p-10 shadow-sm flex flex-col transition-colors">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Basic</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">Perfect for getting started</p>
          <div className="mb-10">
            <span className="text-5xl font-extrabold text-slate-900 dark:text-white">Free</span>
          </div>
          <ul className="space-y-5 flex-1 mb-10">
            <li className="flex items-start gap-4 text-sm text-slate-700 dark:text-slate-300 font-medium">
              <Check size={20} className="text-slate-400 dark:text-slate-500 flex-shrink-0 mt-0.5" />
              <span>2 Resume ATS Scans / month</span>
            </li>
            <li className="flex items-start gap-4 text-sm text-slate-700 dark:text-slate-300 font-medium">
              <Check size={20} className="text-slate-400 dark:text-slate-500 flex-shrink-0 mt-0.5" />
              <span>1 Standard Cover Letter / month</span>
            </li>
            <li className="flex items-start gap-4 text-sm text-slate-700 dark:text-slate-300 font-medium">
              <Check size={20} className="text-slate-400 dark:text-slate-500 flex-shrink-0 mt-0.5" />
              <span>1 Text-based Mock Interview</span>
            </li>
            <li className="flex items-start gap-4 text-sm text-slate-700 dark:text-slate-300 font-medium">
              <Check size={20} className="text-slate-400 dark:text-slate-500 flex-shrink-0 mt-0.5" />
              <span>Standard Job Kanban Board</span>
            </li>
          </ul>
          <button disabled className="w-full py-4 px-6 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold rounded-2xl cursor-not-allowed border border-slate-200 dark:border-slate-700 transition-colors">
            Your Current Plan
          </button>
        </div>

        {/* Pro Plan */}
        <div className="bg-gradient-to-b from-blue-900 to-slate-900 dark:from-blue-950 dark:to-slate-950 rounded-3xl border border-blue-700/50 dark:border-blue-800 p-8 md:p-10 shadow-2xl shadow-blue-900/20 flex flex-col relative transform md:-translate-y-4 transition-all hover:shadow-blue-900/40">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <span className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-xs font-extrabold px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg shadow-blue-500/30 tracking-widest uppercase">
              <Crown size={14} /> Most Popular
            </span>
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-2 mt-2">Pro Access</h3>
          <p className="text-blue-200/80 text-sm mb-8">For serious job seekers</p>
          <div className="mb-10 flex items-end gap-1">
            <span className="text-5xl font-extrabold text-white">₹499</span>
            <span className="text-blue-200/80 font-medium mb-1">/month</span>
          </div>
          <ul className="space-y-5 flex-1 mb-10">
            <li className="flex items-start gap-4 text-sm text-blue-50 font-medium">
              <CheckCircle size={20} className="text-cyan-400 flex-shrink-0 mt-0.5" />
              <span><strong className="text-white">Unlimited Auto-Tailoring:</strong> AI rewrites your resume perfectly for any job description.</span>
            </li>
            <li className="flex items-start gap-4 text-sm text-blue-50 font-medium">
              <CheckCircle size={20} className="text-cyan-400 flex-shrink-0 mt-0.5" />
              <span><strong className="text-white">Unlimited Voice Interviews:</strong> Talk directly to our AI for realistic behavioral & technical prep.</span>
            </li>
            <li className="flex items-start gap-4 text-sm text-blue-50 font-medium">
              <CheckCircle size={20} className="text-cyan-400 flex-shrink-0 mt-0.5" />
              <span><strong className="text-white">Infinite Cover Letters:</strong> Select tone (creative/formal) and generate instantly.</span>
            </li>
            <li className="flex items-start gap-4 text-sm text-blue-50 font-medium">
              <CheckCircle size={20} className="text-cyan-400 flex-shrink-0 mt-0.5" />
              <span><strong className="text-white">LinkedIn Optimizer:</strong> Get a custom profile audit, headline, and about section.</span>
            </li>
            <li className="flex items-start gap-4 text-sm text-blue-50 font-medium">
              <CheckCircle size={20} className="text-cyan-400 flex-shrink-0 mt-0.5" />
              <span><strong className="text-white">Early Job Alerts:</strong> Priority notifications for perfect matches.</span>
            </li>
          </ul>
          {user?.isPro ? (
            <button disabled className="w-full py-4 px-6 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-extrabold rounded-2xl flex items-center justify-center gap-2 cursor-default">
              <CheckCircle size={20} /> Active Pro Member
            </button>
          ) : (
            <button 
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-extrabold rounded-2xl transition-all shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <><Loader2 size={20} className="animate-spin" /> Processing Payment...</>
              ) : (
                <><Zap size={20} className="fill-white" /> Upgrade Now</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Upgrade;
