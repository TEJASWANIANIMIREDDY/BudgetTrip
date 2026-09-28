import React, { useState } from 'react';
import { Sparkles, DollarSign, Check, ArrowDownRight, RefreshCw, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CheaperSuggestion, Currency, DestinationPlan } from '../types/travel';
import { formatCurrency } from '../utils/formatters';

interface BudgetOptimizerProps {
  destination: DestinationPlan;
  currency: Currency;
  userBudget: number;
  onApplySavings: (savingsTotal: number, updatedSuggestions: CheaperSuggestion[]) => void;
}

export const BudgetOptimizer: React.FC<BudgetOptimizerProps> = ({
  destination,
  currency,
  userBudget,
  onApplySavings
}) => {
  const [suggestions, setSuggestions] = useState<CheaperSuggestion[]>(
    destination.cheaperSuggestions || []
  );
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [hasRunOptimization, setHasRunOptimization] = useState<boolean>(false);

  const handleToggle = (id: string) => {
    setSuggestions(prev =>
      prev.map(s => (s.id === id ? { ...s, applied: !s.applied } : s))
    );
  };

  const handleRunAiOptimizer = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/optimize-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination, budget: userBudget }),
      });
      const data = await response.json();
      if (data.success && data.suggestions && data.suggestions.length > 0) {
        setSuggestions(data.suggestions);
      }
    } catch (e) {
      console.error('AI optimization failed, using local agent recommendations', e);
    } finally {
      setIsAnalyzing(false);
      setHasRunOptimization(true);
    }
  };

  const appliedSavings = suggestions
    .filter(s => s.applied)
    .reduce((acc, curr) => acc + curr.potentialSavings, 0);

  const totalPossibleSavings = suggestions.reduce(
    (acc, curr) => acc + curr.potentialSavings,
    0
  );

  const handleApplyAllChanges = () => {
    onApplySavings(appliedSavings, suggestions);
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // no-op
    }
  };

  return (
    <div className="bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-slate-900/5 dark:from-emerald-950/40 dark:via-teal-950/20 dark:to-slate-900 rounded-3xl border border-emerald-500/30 shadow-xl p-6 sm:p-8 space-y-6">
      {/* Header & Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-emerald-500/20">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-500/25 mb-2">
            <Zap className="w-3.5 h-3.5" />
            AI Cost Reduction Agent
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            &ldquo;Make It Cheaper&rdquo; Travel Optimizer
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
            Our agent analyzes transportation, stays, dining, and passes to extract maximum savings without diminishing your holiday.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRunAiOptimizer}
          disabled={isAnalyzing}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/30 active:scale-95 transition-all disabled:opacity-50 cursor-pointer shrink-0"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Scanning Cost Vectors...
            </>
          ) : (
            <>
              <DollarSign className="w-4 h-4" />
              💰 Make My Trip Cheaper
            </>
          )}
        </button>
      </div>

      {/* Potential Savings Banner */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-4 rounded-2xl border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-black text-lg">
            ₹
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              Potential Savings Identified
            </span>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
              Up to {formatCurrency(totalPossibleSavings, currency)}
            </div>
          </div>
        </div>

        {appliedSavings > 0 && (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-slate-400 block font-medium">Selected to apply</span>
              <span className="text-base font-extrabold text-slate-900 dark:text-white">
                {formatCurrency(appliedSavings, currency)}
              </span>
            </div>
            <button
              type="button"
              onClick={handleApplyAllChanges}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 cursor-pointer transition-all"
            >
              Apply Changes
            </button>
          </div>
        )}
      </div>

      {/* Suggestions List */}
      <div className="space-y-3">
        {suggestions.map((suggestion) => {
          return (
            <div
              key={suggestion.id}
              onClick={() => handleToggle(suggestion.id)}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                suggestion.applied
                  ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/50 shadow-md ring-2 ring-emerald-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-6 h-6 rounded-lg mt-0.5 flex items-center justify-center transition-colors shrink-0 ${
                    suggestion.applied
                      ? 'bg-emerald-600 text-white'
                      : 'border-2 border-slate-300 dark:border-slate-600'
                  }`}
                >
                  {suggestion.applied && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {suggestion.category}
                    </span>
                    <h5 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                      {suggestion.title}
                    </h5>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {suggestion.description}
                  </p>
                </div>
              </div>

              <div className="sm:text-right shrink-0 pl-9 sm:pl-0">
                <span className="text-xs font-bold text-slate-400 block">Save</span>
                <span className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400">
                  -{formatCurrency(suggestion.potentialSavings, currency)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
