import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  X,
  Bot,
  User,
  Sparkles,
  ChevronDown,
  RefreshCw,
  Zap,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Settings2,
  Info
} from 'lucide-react';
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

const N8N_DEFAULT_WEBHOOK = 'https://tejaswani-13.app.n8n.cloud/webhook/66b438cc-9d83-4419-b593-080b264a4047/chat';

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
  const [engine, setEngine] = useState<'n8n' | 'gemini'>('n8n');
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const [n8nStatus, setN8nStatus] = useState<{ checked: boolean; isActive: boolean; status?: number; hint?: string }>({
    checked: false,
    isActive: false
  });

  // Session ID for n8n conversational memory
  const [sessionId] = useState<string>(() => {
    const existing = localStorage.getItem('budget_trip_n8n_session');
    if (existing) return existing;
    const newId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    localStorage.setItem('budget_trip_n8n_session', newId);
    return newId;
  });

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      source: 'n8n',
      content: `Hello! I'm connected to your **n8n AI Chatbot Agent** and **BudgetTrip AI Engine**.\n\nAsk me anything about flights, hotel discounts, day plans, or say *"Make it cheaper"* for ${currentDestination?.country || 'your trip'}!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check n8n status on open
  useEffect(() => {
    if (isOpen && !n8nStatus.checked) {
      checkN8nStatus();
    }
  }, [isOpen]);

  const checkN8nStatus = async () => {
    try {
      const res = await fetch('/api/n8n-status');
      const data = await res.json();
      setN8nStatus({
        checked: true,
        isActive: data.isActive,
        status: data.status,
        hint: data.hint
      });
    } catch {
      setN8nStatus({
        checked: true,
        isActive: false,
        hint: 'Could not contact n8n server'
      });
    }
  };

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
          sessionId,
          engine: engine === 'n8n' ? 'n8n' : 'gemini-only',
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
        source: data.source || (engine === 'n8n' ? 'n8n' : 'gemini'),
        content: data.reply || "I've reviewed the numbers. Let me know what specific adjustment you'd like!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionTriggered: actionObj
      };

      setMessages(prev => [...prev, botReply]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          source: 'system',
          content: `For **${currentDestination?.country || 'this trip'}**, staying in local guesthouses and using local transit can save between ₹3,000 to ₹6,000. Try our "Make It Cheaper" button to apply verified discounts!`,
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
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-tr from-emerald-600 via-teal-600 to-amber-500 hover:from-emerald-500 hover:to-teal-400 text-white p-3.5 sm:px-4 sm:py-3.5 rounded-2xl shadow-2xl shadow-emerald-600/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 cursor-pointer group"
          aria-label="Open n8n AI Travel Assistant"
        >
          <div className="relative">
            <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
            <span className="w-2.5 h-2.5 bg-emerald-300 rounded-full absolute -top-1 -right-1 animate-ping" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="font-black text-xs uppercase tracking-wider flex items-center gap-1 text-emerald-100">
              n8n Chatbot
            </div>
            <div className="font-extrabold text-sm leading-tight">
              Ask Travel AI
            </div>
          </div>
        </button>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[95vw] sm:w-[440px] max-h-[88vh] h-[640px] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden transition-all animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-900 p-3.5 text-white flex items-center justify-between border-b border-emerald-800/40">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center font-bold text-white shadow-md shrink-0">
                <Zap className="w-5 h-5 fill-white text-white" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="font-black text-sm tracking-tight text-white flex items-center gap-1">
                    n8n AI Chatbot
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Live
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 truncate">
                  {currentDestination ? `${currentDestination.flagEmoji} ${currentDestination.country}` : 'Budget Travel Intelligence'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setShowConfig(!showConfig)}
                title="n8n Integration Details"
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                  showConfig ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Settings2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* n8n Status / Settings Drawer */}
          {showConfig && (
            <div className="bg-slate-900 border-b border-slate-800 p-3 text-xs text-slate-300 animate-in slide-in-from-top-2">
              <div className="flex items-center justify-between mb-2">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  n8n Webhook Connection
                </div>
                <button
                  type="button"
                  onClick={checkN8nStatus}
                  className="text-[10px] text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
                >
                  Test Ping
                </button>
              </div>

              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[10px] text-slate-300 break-all select-all mb-2">
                {N8N_DEFAULT_WEBHOOK}
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1">
                <div className="flex items-center gap-1.5">
                  {n8nStatus.isActive ? (
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Active in n8n Cloud
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-amber-300 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Draft / Standby (Gemini Fallback Ready)
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-0.5">
                  <button
                    type="button"
                    onClick={() => setEngine('n8n')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                      engine === 'n8n' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    n8n
                  </button>
                  <button
                    type="button"
                    onClick={() => setEngine('gemini')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                      engine === 'gemini' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Gemini
                  </button>
                </div>
              </div>

              {!n8nStatus.isActive && (
                <div className="mt-2 text-[10.5px] leading-relaxed text-amber-200/90 bg-amber-950/40 border border-amber-800/50 rounded-lg p-2 flex items-start gap-1.5">
                  <Info className="w-3.5 h-3.5 shrink-0 text-amber-400 mt-0.5" />
                  <span>
                    <strong>Quick Tip:</strong> In your n8n canvas editor, toggle the switch at the top-right to <strong>Active</strong> to receive live responses from your n8n workflow. The assistant automatically uses Gemini until activated.
                  </span>
                </div>
              )}
            </div>
          )}

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
                    className={`max-w-[88%] rounded-2xl p-3.5 leading-relaxed shadow-sm ${
                      isBot
                        ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80 rounded-tl-sm'
                        : 'bg-emerald-600 text-white rounded-tr-sm'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>

                    {/* Action button if attached */}
                    {msg.actionTriggered && (
                      <button
                        type="button"
                        onClick={() => handleActionClick(msg.actionTriggered?.type)}
                        className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        {msg.actionTriggered.label}
                      </button>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1.5 mt-1 px-1 text-[10px] text-slate-400">
                    {isBot && (
                      <span className={`font-semibold inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded ${
                        msg.source === 'n8n'
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                          : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                      }`}>
                        {msg.source === 'n8n' ? (
                          <>
                            <Zap className="w-2.5 h-2.5 fill-current" /> n8n
                          </>
                        ) : (
                          <>
                            <Bot className="w-2.5 h-2.5" /> Gemini
                          </>
                        )}
                      </span>
                    )}
                    <span>{msg.timestamp}</span>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2.5 p-3 bg-white dark:bg-slate-800 rounded-2xl w-fit border border-slate-200 dark:border-slate-700 shadow-sm animate-pulse">
                <RefreshCw className="w-4 h-4 animate-spin text-amber-500" />
                <span className="text-slate-600 dark:text-slate-300 font-medium">
                  {engine === 'n8n' ? 'Executing n8n AI workflow...' : 'Analyzing budget with Gemini...'}
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
                className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300 shrink-0 transition-colors cursor-pointer whitespace-nowrap"
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
              placeholder="Ask n8n AI (e.g. Can I travel with ₹30,000?)..."
              className="flex-1 px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="p-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white rounded-xl shadow-md transition-all cursor-pointer shrink-0"
              title="Send to n8n AI Chatbot"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
