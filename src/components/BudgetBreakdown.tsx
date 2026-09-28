import React from 'react';
import { Plane, Hotel, Train, Utensils, Ticket, ShieldAlert, Sparkles, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { DestinationPlan, Currency } from '../types/travel';
import { formatCurrency } from '../utils/formatters';

interface BudgetBreakdownProps {
  destination: DestinationPlan;
  currency: Currency;
  userBudget: number;
}

export const BudgetBreakdown: React.FC<BudgetBreakdownProps> = ({
  destination,
  currency,
  userBudget
}) => {
  const { breakdown } = destination;
  const total = breakdown.total;
  const remaining = userBudget - total;
  const isWithinBudget = remaining >= 0;

  const categories = [
    { key: 'flights', label: 'Flights / Long-distance', cost: breakdown.flights, icon: '✈️', color: 'bg-sky-500', barBg: 'bg-sky-50 dark:bg-sky-950/40', textCol: 'text-sky-600 dark:text-sky-400' },
    { key: 'hotels', label: 'Hotels / Accommodation', cost: breakdown.hotels, icon: '🏨', color: 'bg-emerald-500', barBg: 'bg-emerald-50 dark:bg-emerald-950/40', textCol: 'text-emerald-600 dark:text-emerald-400' },
    { key: 'localTransport', label: 'Local Transport (Tuk-tuk/Metro/Cabs)', cost: breakdown.localTransport, icon: '🚆', color: 'bg-indigo-500', barBg: 'bg-indigo-50 dark:bg-indigo-950/40', textCol: 'text-indigo-600 dark:text-indigo-400' },
    { key: 'food', label: 'Food & Dining (Street eats & Cafes)', cost: breakdown.food, icon: '🍜', color: 'bg-amber-500', barBg: 'bg-amber-50 dark:bg-amber-950/40', textCol: 'text-amber-600 dark:text-amber-400' },
    { key: 'activities', label: 'Activities & Entry Tickets', cost: breakdown.activities, icon: '🎟️', color: 'bg-rose-500', barBg: 'bg-rose-50 dark:bg-rose-950/40', textCol: 'text-rose-600 dark:text-rose-400' },
    { key: 'emergencyMisc', label: 'Emergency & Miscellaneous Buffer', cost: breakdown.emergencyMisc, icon: '💰', color: 'bg-teal-500', barBg: 'bg-teal-50 dark:bg-teal-950/40', textCol: 'text-teal-600 dark:text-teal-400' },
  ];

  // Find the largest expense
  const sorted = [...categories].sort((a, b) => b.cost - a.cost);
  const largest = sorted[0];
  const largestPct = Math.round((largest.cost / (total || 1)) * 100);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-lg p-6 sm:p-8 space-y-6">
      {/* Header with Title and Big Total */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            <span>{destination.flagEmoji}</span>
            <span>{destination.country} — {destination.recommendedDuration} Days</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Complete Trip Budget Breakdown
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Realistically estimated for all travelers based on actual seasonal costs and local purchasing power.
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 text-right">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider block">
            Estimated Total
          </span>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {formatCurrency(total, currency)}
          </div>
          <div className="mt-1 flex items-center justify-end gap-1.5">
            {isWithinBudget ? (
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Budget remaining: {formatCurrency(remaining, currency)}
              </span>
            ) : (
              <span className="text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 rounded-md flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Over budget by {formatCurrency(Math.abs(remaining), currency)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Visual Proportional Expense Share Bar */}
      <div>
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
          <span>Expense Distribution</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Largest expense: {largest.icon} {largest.label.split(' ')[0]} ({largestPct}%)
          </span>
        </div>
        {/* Multi-segment Progress Bar */}
        <div className="w-full h-4 rounded-xl overflow-hidden flex bg-slate-100 dark:bg-slate-800 shadow-inner">
          {categories.map((c) => {
            const pct = (c.cost / (total || 1)) * 100;
            return (
              <div
                key={c.key}
                title={`${c.label}: ${formatCurrency(c.cost, currency)} (${Math.round(pct)}%)`}
                className={`${c.color} h-full transition-all duration-500 hover:opacity-90 relative group cursor-pointer`}
                style={{ width: `${pct}%` }}
              />
            );
          })}
        </div>
        {/* Legend */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-[11px] text-slate-600 dark:text-slate-400">
          {categories.map((c) => (
            <div key={c.key} className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${c.color}`} />
              <span className="font-semibold">{c.icon} {c.label.split('/')[0]}</span>
              <span className="opacity-75">({Math.round((c.cost / (total || 1)) * 100)}%)</span>
            </div>
          ))}
        </div>
      </div>

      {/* Itemized Table / Cards */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/80 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <th className="py-3 px-4">Expense Category</th>
              <th className="py-3 px-4 text-center">Share</th>
              <th className="py-3 px-4 text-right">Estimated Cost</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {categories.map((c) => {
              const pct = Math.round((c.cost / (total || 1)) * 100);
              const isDominant = c.key === largest.key;
              return (
                <tr 
                  key={c.key} 
                  className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors ${
                    isDominant ? 'bg-emerald-50/20 dark:bg-emerald-950/10' : ''
                  }`}
                >
                  <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{c.icon}</span>
                      <div>
                        <span>{c.label}</span>
                        {isDominant && (
                          <span className="ml-2 text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                            Major Share
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {pct}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-black text-slate-900 dark:text-white">
                    {formatCurrency(c.cost, currency)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-slate-50 dark:bg-slate-800/90 font-black border-t-2 border-slate-300 dark:border-slate-700">
              <td className="py-4 px-4 text-slate-900 dark:text-white">
                Total Estimated Cost
              </td>
              <td className="py-4 px-4 text-center text-xs font-bold text-slate-500">
                100%
              </td>
              <td className="py-4 px-4 text-right text-lg text-emerald-600 dark:text-emerald-400">
                {formatCurrency(total, currency)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
