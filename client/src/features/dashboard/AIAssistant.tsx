import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, Sparkles } from 'lucide-react';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

interface AIAssistantProps {
  mode?: 'popup' | 'page';
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTIONS = [
  "💰 How can I save more money?",
  "📊 Analyze my monthly spending.",
  "📈 Show my highest expense category.",
  "🎯 Suggest a better monthly budget.",
  "💳 How can I reduce unnecessary expenses?",
  "📅 Summarize this month's finances.",
  "📉 Why is my Financial Health score low?",
  "🚨 Which bills are due soon?",
  "🎯 How close am I to my savings goal?",
  "📈 Compare this month with last month.",
  "💡 Give me personalized financial tips.",
  "📋 Generate my monthly financial report."
];

export const AIAssistant: React.FC<AIAssistantProps> = ({ mode = 'popup' }) => {
  const [isOpen, setIsOpen] = useState(mode === 'page');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hi there! I am SpendWise AI, your personal financial advisor. How can I help you manage your finances today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen || mode === 'page') {
      scrollToBottom();
    }
  }, [messages, isOpen, mode]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: text.trim() };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const res = await api.post('/ai/advisor', { message: userMessage.content });
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: res.data.reply
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('AI Error:', error);
      const errorMsg = error.response?.data?.error || 'AI Assistant is temporarily unavailable. Please try again later.';
      toast.error(errorMsg);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `**Error**: ${errorMsg}`
      };
      setMessages(prev => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const textToSend = input;
    setInput('');
    await sendMessage(textToSend);
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const chatUI = (
    <div
      className={
        mode === 'page'
          ? "flex flex-col h-[calc(100vh-160px)] w-full bg-[var(--bg-card)] backdrop-blur-lg rounded-2xl shadow-[var(--shadow-sm)] border border-transparent gradient-border-card overflow-hidden transition-all"
          : "fixed bottom-6 right-6 md:right-8 md:bottom-8 w-[90vw] md:w-[400px] h-[650px] max-h-[85vh] bg-[var(--bg-card)] backdrop-blur-xl rounded-2xl shadow-[var(--shadow-xl)] border border-transparent gradient-border-card flex flex-col z-[101] overflow-hidden"
      }
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] bg-[rgba(255,255,255,0.02)] backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[rgba(16,185,129,0.15)] shadow-[0_0_10px_rgba(16,185,129,0.2)] flex items-center justify-center text-emerald-400">
            <Bot size={18} />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white">SpendWise AI</h3>
            <p className="text-[10px] text-emerald-400 font-bold tracking-[0.15em] uppercase">Financial Advisor</p>
          </div>
        </div>
        {mode === 'popup' && (
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Suggestions Chips */}
      <div className="px-5 py-3 border-b border-[var(--border)] bg-[rgba(0,0,0,0.2)] overflow-x-auto flex gap-2 flex-shrink-0 custom-scrollbar">
        {SUGGESTIONS.map((s, idx) => (
          <button
            key={idx}
            onClick={() => handleSuggestionClick(s)}
            disabled={isLoading}
            className="px-3.5 py-1.5 rounded-full border border-[rgba(16,185,129,0.2)] bg-[rgba(16,185,129,0.1)] text-emerald-400 text-[12px] font-semibold hover:bg-[rgba(16,185,129,0.2)] hover:border-[rgba(16,185,129,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar bg-transparent">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-[rgba(16,185,129,0.15)] border border-[rgba(16,185,129,0.2)] flex items-center justify-center flex-shrink-0 text-emerald-400 mt-1 shadow-sm">
                <Bot size={14} />
              </div>
            )}
            <div
              className={`px-4 py-3 rounded-2xl text-[14px] max-w-[80%] leading-relaxed shadow-sm ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-tr-sm shadow-[0_4px_12px_rgba(16,185,129,0.2)]'
                  : 'bg-[rgba(255,255,255,0.03)] text-slate-200 rounded-tl-sm border border-[var(--border)] backdrop-blur-md'
              }`}
            >
              {msg.role === 'user' ? (
                <p className="font-medium tracking-wide">{msg.content}</p>
              ) : (
                <div className="prose prose-sm dark:prose-invert prose-p:leading-relaxed prose-pre:bg-black/40 max-w-none text-slate-300">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              )}
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 justify-start"
          >
            <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center flex-shrink-0 text-emerald-600 dark:text-emerald-400 mt-1">
              <Bot size={14} />
            </div>
            <div className="px-4 py-4 rounded-2xl bg-white dark:bg-slate-900 rounded-tl-sm border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-1.5">
              <motion.div className="w-1.5 h-1.5 bg-emerald-500/60 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
              <motion.div className="w-1.5 h-1.5 bg-emerald-500/60 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
              <motion.div className="w-1.5 h-1.5 bg-emerald-500/60 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[rgba(255,255,255,0.02)] border-t border-[var(--border)] backdrop-blur-md">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your finances..."
            disabled={isLoading}
            className="w-full pl-4 pr-12 py-3 bg-[rgba(0,0,0,0.3)] border border-[var(--border)] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all disabled:opacity-50 shadow-inner"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 rounded-lg text-emerald-400 hover:bg-[rgba(16,185,129,0.1)] disabled:opacity-40 transition-colors"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );

  if (mode === 'page') {
    return chatUI;
  }

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-[0_0_20px_var(--neon-emerald)] flex items-center justify-center z-50 hover:shadow-[0_0_40px_var(--neon-teal)] focus:outline-none focus:ring-4 focus:ring-emerald-500/30 transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
      >
        <Sparkles size={24} />
      </motion.button>

      {/* Chat Drawer / Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-6 right-6 md:right-8 md:bottom-8 w-[90vw] md:w-[400px] h-[650px] max-h-[85vh] z-[101]"
              style={{ pointerEvents: 'none' }}
            >
              {/* To make pointer events work correctly we wrap it */}
              <div style={{ pointerEvents: 'auto' }} className="h-full w-full">
                {chatUI}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
