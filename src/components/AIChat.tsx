import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, Sparkles, ChevronDown, Minimize2, Maximize2, RefreshCw } from 'lucide-react';
import { DestinationPlan, UserInput, ChatMessage, Currency } from '../types/travel';
import { formatCurrency } from '../utils/formatters';

interface AIChatProps {
  currentDestination: DestinationPlan | null;
  userInput: UserInput;
  currency: Currency;
  onApplySavings?: () => void;
  onSelectBudgetHotel?: () => void;
  onAddDay?: () => void;
}

const DEFAULT_QUESTIONS = [
  "Can I travel here with ₹30,000?",
  "Find a cheaper hotel.",
  "Replace Day 3 with something adventurous.",
  "Can I add one more day?",
  "Make this trip suitable for two people.",
  "Which destination is cheaper?"
];

export const AIChat: React.FC<AIChatProps> = ({
  currentDestination,
  userInput,
  currency,
  onApplySavings,
  onSelectBudgetHotel,
  onAddDay
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I'm your **BudgetTrip AI Agent**. I can recalculate budgets, recommend secret money-saving spots, and adjust your plan for ${currentDestination?.country || 'any destination'}. How can I assist your trip?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          currentDestination,
          userInput
        })
      });

      const data = await response.json();
      
      // Determine if a quick action button should be attached
      let actionObj = undefined;
      const lower = query.toLowerCase();
      if (lower.includes('cheaper') || lower.includes('save') || lower.includes('30,000')) {
        actionObj = {
          type: 'APPLY_DISCOUNT' as const,
          label: '⚡ Open Cost Optimizer'
        };
      } else if (lower.includes('hotel')) {
        actionObj = {
          type: 'CHANGE_HOTEL' as const,
          label: '🏨 Select Budget Stay'
        };
      } else if (lower.includes('add one more day') || lower.includes('one more day')) {
        actionObj = {
          type: 'REPLACE_DAY' as const,
          label: '📅 Add Extra Day'
        };
      }

      const botReply: ChatMessage = {
        id: `b-${Date.now()}`,
        role: 'assistant',
        content: data.reply || "I've reviewed the numbers. Let me know what specific adjustment you'd like!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionTriggered: actionObj
      };

      setMessages(prev => [...prev, botReply]);
    } catch (e) {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: `For **${currentDestination?.country || 'this trip'}**, staying in local guesthouses and using local metro/trains can save between ₹3,000 to ₹6,000. Try our "Make It Cheaper" button to apply verified discounts!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (actionType?: string) => {
    if (actionType === 'APPLY_DISCOUNT' && onApplySavings) {
      onApplySavings();
    } else if (actionType === 'CHANGE_HOTEL' && onSelectBudgetHotel) {
      onSelectBudgetHotel();
    } else if (actionType === 'REPLACE_DAY' && onAddDay) {
      onAddDay();
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-tr from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white p-4 rounded-2xl shadow-2xl shadow-emerald-600/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 cursor-pointer group"
          aria-label="Open AI Travel Assistant"
        >
          <div className="relative">
            <Bot className="w-6 h-6" />
            <span className="w-2.5 h-2.5 bg-emerald-300 rounded-full absolute -top-1 -right-1 animate-ping" />
          </div>
          <span className="font-extrabold text-sm hidden sm:inline">
            Ask Travel AI
          </span>
        </button>
      )}

      {/* Slide-out / Floating Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full sm:w-[420px] max-h-[85vh] h-[600px] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden transition-all animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-white">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm flex items-center gap-1.5">
                  BudgetTrip AI Assistant
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                </h4>
                <p className="text-[11px] text-white/80 line-clamp-1">
                  {currentDestination ? `Analyzing ${currentDestination.country}` : 'Ready to optimize your travel'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/90 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50 dark:bg-slate-950 text-xs">
            {messages.map((msg) => {
              const isBot = msg.role === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed shadow-sm ${
                      isBot
                        ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80 rounded-tl-sm'
                        : 'bg-emerald-600 text-white rounded-tr-sm'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>

                    {/* Action button if present */}
                    {msg.actionTriggered && (
                      <button
                        type="button"
                        onClick={() => handleActionClick(msg.actionTriggered?.type)}
                        className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        {msg.actionTriggered.label}
                      </button>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 p-3 bg-white dark:bg-slate-800 rounded-2xl w-fit border border-slate-200 dark:border-slate-700">
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-500" />
                <span className="text-slate-500 dark:text-slate-400">
                  Calculating real-time costs...
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Carousel */}
          <div className="px-3 py-2 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {DEFAULT_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(q)}
                className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300 shrink-0 transition-colors cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask anything (e.g. Can I travel with ₹30,000?)..."
              className="flex-1 px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="p-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
