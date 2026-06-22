import { useState, useEffect } from 'react';
import { Send, Copy, RefreshCw, Mail, History, Users } from 'lucide-react';
import { networkingService } from '../services/api';

const Networking = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    recipientName: '',
    recipientRole: '',
    company: '',
    messageType: 'LinkedIn Connection'
  });
  const [currentGenerated, setCurrentGenerated] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const data = await networkingService.getMessages();
      setMessages(data);
    } catch (error) {
      console.error('Failed to fetch networking messages', error);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setCurrentGenerated(null);
    try {
      const data = await networkingService.generateMessage(formData);
      setCurrentGenerated(data);
      setMessages([data, ...messages]);
      setFormData({ recipientName: '', recipientRole: '', company: '', messageType: 'LinkedIn Connection' });
    } catch (error) {
      console.error('Failed to generate message', error);
      alert('Failed to generate message');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert('Message copied to clipboard!');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 h-full">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Users className="text-blue-600 dark:text-blue-400" /> AI Networking Assistant
        </h1>
        <p className="text-slate-500 dark:text-slate-400">Generate cold emails, LinkedIn connection requests, and follow-ups instantly.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Generator Form */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Mail className="w-5 h-5 text-indigo-500" /> Compose Message
          </h2>
          
          <form onSubmit={handleGenerate} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Message Type</label>
              <div className="grid grid-cols-3 gap-3">
                {['LinkedIn Connection', 'Cold Email', 'Follow-up Email'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, messageType: type })}
                    className={`py-2 px-3 text-sm font-medium rounded-lg border transition-colors flex items-center justify-center gap-2 ${
                      formData.messageType === type
                        ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/30 dark:border-blue-400 dark:text-blue-300'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-700'
                    }`}
                  >
                    {type === 'LinkedIn Connection' && <Users className="w-4 h-4" />}
                    {type === 'Cold Email' && <Send className="w-4 h-4" />}
                    {type === 'Follow-up Email' && <RefreshCw className="w-4 h-4" />}
                    <span className="hidden sm:inline">{type.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Recipient Name</label>
              <input
                type="text"
                required
                className="w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-900 dark:text-white"
                placeholder="e.g., John Doe"
                value={formData.recipientName}
                onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Their Role</label>
                <input
                  type="text"
                  required
                  className="w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-900 dark:text-white"
                  placeholder="e.g., Senior Recruiter"
                  value={formData.recipientRole}
                  onChange={(e) => setFormData({ ...formData, recipientRole: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Company</label>
                <input
                  type="text"
                  required
                  className="w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-900 dark:text-white"
                  placeholder="e.g., Google"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 dark:disabled:bg-blue-800 transition-colors"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="animate-spin -ml-1 mr-2 h-5 w-5" />
                  Generating...
                </>
              ) : (
                <>
                  <Send className="-ml-1 mr-2 h-5 w-5" />
                  Generate Message
                </>
              )}
            </button>
          </form>

          {/* Current Generated Output */}
          {currentGenerated && (
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Generated Successfully!</h3>
                <button
                  onClick={() => handleCopy(currentGenerated.generatedContent)}
                  className="text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 flex items-center text-sm font-medium transition-colors"
                >
                  <Copy size={16} className="mr-1" /> Copy
                </button>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-sans">
                {currentGenerated.generatedContent}
              </div>
            </div>
          )}
        </div>

        {/* History Area */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 h-[600px] flex flex-col">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <History className="w-5 h-5 text-slate-500" /> Message History
          </h2>
          
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
            {messages.length === 0 ? (
              <div className="text-center text-slate-500 dark:text-slate-400 mt-20">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No messages generated yet.</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg._id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors group">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300 mb-1">
                        {msg.messageType}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">To: {msg.recipientName}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{msg.recipientRole} at {msg.company}</p>
                    </div>
                    <button
                      onClick={() => handleCopy(msg.generatedContent)}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-blue-600 transition-all"
                      title="Copy Message"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 mt-2 bg-slate-50 dark:bg-slate-900/50 p-2 rounded">
                    {msg.generatedContent}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Networking;
