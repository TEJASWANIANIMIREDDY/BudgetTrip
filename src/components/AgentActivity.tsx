import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle2, Loader2, Compass, Coins, Plane, Hotel } from 'lucide-react';
import { UserInput, Currency } from '../types/travel';
import { formatCurrency } from '../utils/formatters';

interface AgentActivityProps {
  userInput: UserInput;
  currency: Currency;
  onComplete: () => void;
}

const AGENT_STEPS = [
  { id: 1, text: 'Understanding your budget', icon: Coins, delay: 600 },
  { id: 2, text: 'Checking destination suitability', icon: Compass, delay: 1300 },
  { id: 3, text: 'Estimating transportation costs', icon: Plane, delay: 2000 },
  { id: 4, text: 'Estimating accommodation costs', icon: Hotel, delay: 2700 },
  { id: 5, text: 'Comparing activities', icon: Sparkles, delay: 3400 },
  { id: 6, text: 'Building your travel plan', icon: CheckCircle2, delay: 4100 },
];

export const AgentActivity: React.FC<AgentActivityProps> = ({
  userInput,
  currency,
  onComplete
}) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  useEffect(() => {
    AGENT_STEPS.forEach((step, idx) => {
      setTimeout(() => {
        setCurrentStepIndex(idx);
        setCompletedSteps(prev => [...prev, step.id]);
        if (idx === AGENT_STEPS.length - 1) {
          setTimeout(() => {
            onComplete();
          }, 800);
        }
      }, step.delay);
    });
  }, [onComplete]);

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl p-8 sm:p-10 relative overflow-hidden">
        {/* Glow backdrop effect */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center mb-8 relative">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white shadow-xl shadow-emerald-500/25 mb-4 animate-bounce">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Finding destinations for you...
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">
            Analyzing {formatCurrency(userInput.budget, currency)} budget for {userInput.adults + userInput.children} travelers departing from {userInput.fromCity}.
          </p>
        </div>

        {/* Step List */}
        <div className="space-y-3.5 relative">
          {AGENT_STEPS.map((step, idx) => {
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = currentStepIndex === idx && !isCompleted;
            const StepIcon = step.icon;

            return (
              <div
                key={step.id}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-300 ${
                  isCompleted
                    ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                    : isCurrent
                    ? 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md ring-2 ring-emerald-500/20 text-slate-900 dark:text-white'
                    : 'border-slate-100 dark:border-slate-800/40 bg-slate-50/50 dark:bg-slate-800/20 text-slate-400 dark:text-slate-600 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                      isCompleted
                        ? 'bg-emerald-500 text-white'
                        : isCurrent
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    <StepIcon className="w-4 h-4" />
                  </div>
                  <span className={`text-sm font-semibold ${isCompleted ? 'text-emerald-800 dark:text-emerald-200' : ''}`}>
                    {step.text}
                  </span>
                </div>

                <div>
                  {isCompleted ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                      Done
                    </span>
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700 block" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-xs text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          Cross-referencing airline routing & seasonal hotel pricing...
        </div>
      </div>
    </div>
  );
};
