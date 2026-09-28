import React from 'react';
import { Sparkles, Calendar, ArrowRight, Heart, Check, AlertTriangle, CheckCircle } from 'lucide-react';
import { DestinationPlan, Currency } from '../types/travel';
import { formatCurrency } from '../utils/formatters';

interface DestinationCardProps {
  destination: DestinationPlan;
  currency: Currency;
  userBudget: number;
  isSelected?: boolean;
  isFavorite?: boolean;
  onSelect: () => void;
  onToggleFavorite?: () => void;
  onToggleCompare?: () => void;
  isComparing?: boolean;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  currency,
  userBudget,
  isFavorite = false,
  onSelect,
  onToggleFavorite,
  onToggleCompare,
  isComparing = false
}) => {
  const isWithin = destination.estimatedTotal <= userBudget;
  const diff = destination.estimatedTotal - userBudget;

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between">
      {/* Top Image & Floating Badges */}
      <div className="relative h-56 sm:h-60 overflow-hidden">
        <img
          src={destination.heroImage}
          alt={destination.country}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

        {/* Top Floating Controls */}
        <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
          {/* Budget Fit Badge */}
          <div className="flex items-center gap-1.5">
            {isWithin ? (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/90 text-white backdrop-blur-md shadow-md flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                Within your budget
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/95 text-white backdrop-blur-md shadow-md flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                Exceeds by {formatCurrency(diff, currency)}
              </span>
            )}
          </div>

          {/* Favorite & Compare Buttons */}
          <div className="flex items-center gap-1.5">
            {onToggleCompare && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleCompare();
                }}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold backdrop-blur-md transition-all cursor-pointer ${
                  isComparing
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-black/40 hover:bg-black/60 text-white/90'
                }`}
              >
                {isComparing ? '✓ Comparing' : '+ Compare'}
              </button>
            )}

            {onToggleFavorite && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite();
                }}
                className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md flex items-center justify-center text-white transition-all cursor-pointer"
                aria-label="Save to favorites"
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* Bottom Image Overlay Header */}
        <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl">{destination.flagEmoji}</span>
            <h3 className="text-2xl font-black tracking-tight drop-shadow-sm">
              {destination.country}
            </h3>
          </div>
          <p className="text-xs text-slate-200 line-clamp-1 mt-0.5 opacity-90">
            {destination.primaryCity} • {destination.tagline}
          </p>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-5">
        <div className="space-y-4">
          {/* Estimated Total & Duration Row */}
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
                Estimated Total
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {formatCurrency(destination.estimatedTotal, currency)}
                </span>
                <span className="text-[11px] text-slate-400">total trip</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
                Recommended
              </span>
              <div className="inline-flex items-center gap-1 text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                {destination.recommendedDuration} Days
              </div>
            </div>
          </div>

          {/* Travel Style Pills */}
          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 block mb-1.5">
              Travel Style
            </span>
            <div className="flex flex-wrap gap-1.5">
              {destination.travelStyles.map((style, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                >
                  {style}
                </span>
              ))}
            </div>
          </div>

          {/* Why This Fits Reason */}
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/80">
            💡 {destination.whyThisFits}
          </p>
        </div>

        {/* Primary CTA */}
        <button
          type="button"
          onClick={onSelect}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-600/20 active:scale-[0.98] transition-all cursor-pointer group-hover:bg-gradient-to-r group-hover:from-emerald-600 group-hover:to-teal-600"
        >
          <span>View Full Plan</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
