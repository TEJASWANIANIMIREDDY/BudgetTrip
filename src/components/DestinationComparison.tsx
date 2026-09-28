import React from 'react';
import { Check, X, ArrowRight, Scale, Shield, Calendar, MapPin, Sparkles } from 'lucide-react';
import { DestinationPlan, Currency } from '../types/travel';
import { formatCurrency } from '../utils/formatters';

interface DestinationComparisonProps {
  destinations: DestinationPlan[];
  selectedDestinations: DestinationPlan[];
  currency: Currency;
  userBudget: number;
  onSelectDestination: (dest: DestinationPlan) => void;
  onRemoveFromCompare: (id: string) => void;
}

export const DestinationComparison: React.FC<DestinationComparisonProps> = ({
  destinations,
  selectedDestinations,
  currency,
  userBudget,
  onSelectDestination,
  onRemoveFromCompare
}) => {
  const compareList = selectedDestinations.length > 0
    ? selectedDestinations
    : destinations.slice(0, 3);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-2">
            <Scale className="w-3.5 h-3.5" />
            Objective Side-by-Side Analysis
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Compare Destinations
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Compare realistic cost items, transit times, and styles without automated bias. Decide based on your individual priorities.
          </p>
        </div>

        <div className="text-xs font-semibold text-slate-400">
          Comparing {compareList.length} destinations
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800">
              <th className="py-4 px-4 text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-44">
                Metric / Category
              </th>
              {compareList.map((dest) => (
                <th key={dest.id} className="py-4 px-4 min-w-[220px]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{dest.flagEmoji}</span>
                      <div>
                        <span className="font-extrabold text-slate-900 dark:text-white text-base block">
                          {dest.country}
                        </span>
                        <span className="text-xs text-slate-400 font-normal">
                          {dest.primaryCity}
                        </span>
                      </div>
                    </div>

                    {compareList.length > 2 && (
                      <button
                        type="button"
                        onClick={() => onRemoveFromCompare(dest.id)}
                        className="p-1 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                        title="Remove from comparison"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {/* Total Estimated Cost */}
            <tr className="bg-emerald-50/20 dark:bg-emerald-950/20">
              <td className="py-4 px-4 font-black text-slate-900 dark:text-white">
                Estimated Total
              </td>
              {compareList.map((dest) => {
                const isWithin = dest.estimatedTotal <= userBudget;
                return (
                  <td key={dest.id} className="py-4 px-4 font-black">
                    <span className="text-lg text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(dest.estimatedTotal, currency)}
                    </span>
                    <span className={`block text-[11px] font-semibold ${isWithin ? 'text-emerald-600' : 'text-amber-500'}`}>
                      {isWithin ? '✓ Within Budget' : `+${formatCurrency(dest.estimatedTotal - userBudget, currency)}`}
                    </span>
                  </td>
                );
              })}
            </tr>

            {/* Flights & Main Transport */}
            <tr>
              <td className="py-3.5 px-4 font-semibold text-slate-600 dark:text-slate-300">
                ✈️ Flights / Entry
              </td>
              {compareList.map((dest) => (
                <td key={dest.id} className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                  {formatCurrency(dest.breakdown.flights, currency)}
                  <span className="block text-[11px] text-slate-400 font-normal">
                    {dest.transport.travelTime}
                  </span>
                </td>
              ))}
            </tr>

            {/* Hotels */}
            <tr>
              <td className="py-3.5 px-4 font-semibold text-slate-600 dark:text-slate-300">
                🏨 Hotels
              </td>
              {compareList.map((dest) => (
                <td key={dest.id} className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                  {formatCurrency(dest.breakdown.hotels, currency)}
                  <span className="block text-[11px] text-slate-400 font-normal">
                    {dest.recommendedDuration - 1} nights
                  </span>
                </td>
              ))}
            </tr>

            {/* Local Transport */}
            <tr>
              <td className="py-3.5 px-4 font-semibold text-slate-600 dark:text-slate-300">
                🚆 Local Transport
              </td>
              {compareList.map((dest) => (
                <td key={dest.id} className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                  {formatCurrency(dest.breakdown.localTransport, currency)}
                </td>
              ))}
            </tr>

            {/* Activities & Sights */}
            <tr>
              <td className="py-3.5 px-4 font-semibold text-slate-600 dark:text-slate-300">
                🎟️ Activities
              </td>
              {compareList.map((dest) => (
                <td key={dest.id} className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                  {formatCurrency(dest.breakdown.activities, currency)}
                </td>
              ))}
            </tr>

            {/* Food & Dining */}
            <tr>
              <td className="py-3.5 px-4 font-semibold text-slate-600 dark:text-slate-300">
                🍜 Food & Meals
              </td>
              {compareList.map((dest) => (
                <td key={dest.id} className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                  {formatCurrency(dest.breakdown.food, currency)}
                </td>
              ))}
            </tr>

            {/* Daily Average Spend */}
            <tr>
              <td className="py-3.5 px-4 font-semibold text-slate-600 dark:text-slate-300">
                💳 Daily Avg Spend
              </td>
              {compareList.map((dest) => (
                <td key={dest.id} className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                  ~{formatCurrency(dest.dailyAverageSpend, currency)} / day
                </td>
              ))}
            </tr>

            {/* Travel Styles */}
            <tr>
              <td className="py-3.5 px-4 font-semibold text-slate-600 dark:text-slate-300">
                🎯 Best For
              </td>
              {compareList.map((dest) => (
                <td key={dest.id} className="py-3.5 px-4">
                  <div className="flex flex-wrap gap-1">
                    {dest.travelStyles.map((s, idx) => (
                      <span key={idx} className="text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                        {s}
                      </span>
                    ))}
                  </div>
                </td>
              ))}
            </tr>

            {/* Visa Process */}
            <tr>
              <td className="py-3.5 px-4 font-semibold text-slate-600 dark:text-slate-300">
                🛂 Visa Requirement
              </td>
              {compareList.map((dest) => (
                <td key={dest.id} className="py-3.5 px-4 text-xs text-slate-500 dark:text-slate-400">
                  {dest.visaInfo}
                </td>
              ))}
            </tr>

            {/* Action Row */}
            <tr className="bg-slate-50 dark:bg-slate-800/50">
              <td className="py-4 px-4 font-bold text-slate-600">
                Selection
              </td>
              {compareList.map((dest) => (
                <td key={dest.id} className="py-4 px-4">
                  <button
                    type="button"
                    onClick={() => onSelectDestination(dest)}
                    className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>View Full Plan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
