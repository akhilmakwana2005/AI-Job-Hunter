import { useState, useEffect, useRef } from 'react';
import { Mic, Send, Bot, User, PlayCircle, Trophy, Sparkles } from 'lucide-react';
import { interviewService } from '../services/api';

const MockInterview = () => {
  const [role, setRole] = useState('');
  const [session, setSession] = useState(null);
  const [history, setHistory] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const chatEndRef = useRef(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session?.questions, session?.currentQuestionIndex]);

  const fetchHistory = async () => {
    try {
      const data = await interviewService.getInterviews();
      setHistory(data);
    } catch (error) {
      console.error('Failed to fetch interview history', error);
    }
  };

  const handleStart = async (e) => {
    e.preventDefault();
    if (!role) return;
    try {
      const newSession = await interviewService.startInterview({ role });
      setSession(newSession);
    } catch (error) {
      console.error('Failed to start interview', error);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim() || isSubmitting) return;
    setIsSubmitting(true);
    
    // Optimistic UI update for answer
    const tempSession = { ...session };
    tempSession.questions[tempSession.currentQuestionIndex].userAnswer = currentAnswer;
    setSession(tempSession);
    
    try {
      const updatedSession = await interviewService.submitAnswer(session._id, { answer: currentAnswer });
      setSession(updatedSession);
      setCurrentAnswer('');
      if (updatedSession.status === 'completed') {
        fetchHistory(); // refresh history if completed
      }
    } catch (error) {
      console.error('Failed to submit answer', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Bot size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">AI Interviewer</h2>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {session ? `Practicing for: ${session.role}` : 'Ready to practice'}
            </p>
          </div>
        </div>
        {session && session.status === 'completed' && (
          <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-800/50">
            <Trophy size={16} />
            <span className="text-sm font-bold">Score: {session.overallScore}%</span>
          </div>
        )}
      </div>

      {!session ? (
        // Start Screen
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50/50 dark:bg-slate-900/50 transition-colors">
          <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-6">
            <Mic size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 text-center">Voice Mock Interview</h2>
          <p className="text-slate-500 dark:text-slate-400 text-center max-w-md mb-8 leading-relaxed">
            Practice answering behavioral and technical questions with our AI. Get instant feedback on your structure, delivery, and content.
          </p>
          
          <form onSubmit={handleStart} className="w-full max-w-md bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">What role are you interviewing for?</label>
            <input
              required
              type="text"
              placeholder="e.g. Frontend Developer"
              className="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none mb-4 transition-colors"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
            <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white rounded-md py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <PlayCircle size={18} />
              Start Mock Interview
            </button>
          </form>

          {history.length > 0 && (
            <div className="mt-12 w-full max-w-md">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">Past Sessions</h3>
              <div className="space-y-3">
                {history.map((h, i) => (
                  <div key={i} className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 flex justify-between items-center cursor-pointer hover:border-blue-300 dark:hover:border-blue-500 transition-colors" onClick={() => setSession(h)}>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-sm">{h.role}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(h.createdAt).toLocaleDateString()}</p>
                    </div>
                    {h.status === 'completed' ? (
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{h.overallScore}%</span>
                    ) : (
                      <span className="text-xs font-medium bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-1 rounded">Incomplete</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        // Interview Interface
        <div className="flex-1 flex flex-col h-full bg-white dark:bg-slate-800 relative transition-colors">
          
          {/* Chat History Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {session.questions.map((q, idx) => {
              // Only show questions up to current index + 1 (if answered)
              if (idx > session.currentQuestionIndex) return null;
              
              return (
                <div key={idx} className="space-y-6">
                  {/* AI Question */}
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot size={16} />
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-sm px-5 py-3.5 max-w-[80%] shadow-sm">
                      <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">{q.questionText}</p>
                    </div>
                  </div>

                  {/* User Answer */}
                  {q.userAnswer && (
                    <div className="flex gap-4 justify-end">
                      <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-5 py-3.5 max-w-[80%] shadow-sm">
                        <p className="text-sm leading-relaxed">{q.userAnswer}</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center flex-shrink-0 mt-1">
                        <User size={16} />
                      </div>
                    </div>
                  )}

                  {/* AI Feedback */}
                  {q.feedback && (
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 mt-1">
                        <Sparkles size={16} />
                      </div>
                      <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 rounded-2xl rounded-tl-sm px-5 py-3.5 max-w-[80%] shadow-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-500">Feedback</span>
                          <span className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded text-xs font-bold text-emerald-700 dark:text-emerald-400 shadow-sm border border-emerald-100 dark:border-emerald-800/50">Score: {q.score}/10</span>
                        </div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-100 leading-relaxed">{q.feedback}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Loading State for AI Feedback */}
                  {idx === session.currentQuestionIndex && isSubmitting && q.userAnswer && !q.feedback && (
                     <div className="flex gap-4">
                     <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 mt-1">
                       <Bot size={16} />
                     </div>
                     <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-sm px-5 py-4 max-w-[80%] shadow-sm flex items-center gap-2">
                       <div className="w-2 h-2 bg-blue-400 dark:bg-blue-500 rounded-full animate-bounce"></div>
                       <div className="w-2 h-2 bg-blue-400 dark:bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s'}}></div>
                       <div className="w-2 h-2 bg-blue-400 dark:bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s'}}></div>
                     </div>
                   </div>
                  )}
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 transition-colors">
            {session.status === 'completed' ? (
               <div className="text-center p-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Interview Completed!</h3>
                  <button onClick={() => setSession(null)} className="text-blue-600 dark:text-blue-400 font-medium hover:underline">Start a new session</button>
               </div>
            ) : (
              <div className="flex items-end gap-3 max-w-4xl mx-auto">
                <button className="p-3 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 hover:text-slate-700 dark:hover:text-slate-200 rounded-full transition-colors flex-shrink-0">
                  <Mic size={20} />
                </button>
                <textarea
                  className="flex-1 max-h-32 min-h-[50px] p-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm transition-colors"
                  placeholder="Type your answer here or use the microphone..."
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmitAnswer();
                    }
                  }}
                  disabled={isSubmitting}
                />
                <button 
                  onClick={handleSubmitAnswer}
                  disabled={!currentAnswer.trim() || isSubmitting}
                  className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 shadow-sm"
                >
                  <Send size={20} />
                </button>
              </div>
            )}
            <div className="text-center mt-3">
               <span className="text-xs text-slate-400 dark:text-slate-500">Question {Math.min(session.currentQuestionIndex + 1, session.questions.length)} of {session.questions.length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MockInterview;
