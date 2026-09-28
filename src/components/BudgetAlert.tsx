import React from 'react';
import { AlertTriangle, ArrowRight, Zap, RefreshCw, Compass } from 'lucide-react';
import { Currency } from '../types/travel';
import { formatCurrency } from '../utils/formatters';

interface BudgetAlertProps {
  userBudget: number;
  estimatedTotal: number;
  currency: Currency;
  onOpenOptimizer: () => void;
  onSwitchAlternative?: () => void;
}

export const BudgetAlert: React.FC<BudgetAlertProps> = ({
  userBudget,
  estimatedTotal,
  currency,
  onOpenOptimizer,
  onSwitchAlternative
}) => {
  const difference = estimatedTotal - userBudget;
  if (difference <= 0) return null;

  return (
    <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-red-500/10 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-7 shadow-lg space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/30">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>⚠️ This destination may exceed your budget</span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              The estimated itinerary exceeds your configured spending limit. Let the AI help trim expenses or explore closer alternatives.
            </p>
          </div>
        </div>

        {/* Quick Numbers Box */}
        <div className="bg-white/80 dark:bg-slate-900/80 p-3.5 rounded-2xl border border-amber-500/20 text-xs shrink-0 flex items-center gap-4">
          <div>
            <span className="text-slate-400 block font-semibold">Your Budget</span>
            <span className="font-extrabold text-slate-800 dark:text-slate-200">
              {formatCurrency(userBudget, currency)}
            </span>
          </div>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
          <div>
            <span className="text-slate-400 block font-semibold">Estimated Trip</span>
            <span className="font-extrabold text-slate-800 dark:text-slate-200">
              {formatCurrency(estimatedTotal, currency)}
            </span>
          </div>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
          <div>
            <span className="text-rose-500 block font-bold">Difference</span>
            <span className="font-black text-rose-600 dark:text-rose-400">
              +{formatCurrency(difference, currency)}
            </span>
          </div>
        </div>
      </div>

      {/* Suggested Next Steps */}
      <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-amber-500/20">
        <button
          type="button"
          onClick={onOpenOptimizer}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md shadow-amber-500/20 cursor-pointer transition-all"
        >
          <Zap className="w-3.5 h-3.5" />
          Auto-Reduce Cost (Save {formatCurrency(difference, currency)})
        </button>

        {onSwitchAlternative && (
          <button
            type="button"
            onClick={onSwitchAlternative}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold cursor-pointer transition-all"
          >
            <Compass className="w-3.5 h-3.5 text-emerald-500" />
            View Closer Budget Alternatives (e.g. Nepal or Sri Lanka)
          </button>
        )}
      </div>
    </div>
  );
};
