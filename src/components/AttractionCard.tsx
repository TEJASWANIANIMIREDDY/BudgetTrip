import React from 'react';
import { Ticket, Clock, MapPin, Sparkles, Navigation, CheckCircle2, XCircle } from 'lucide-react';
import { Attraction, Currency } from '../types/travel';
import { formatCurrency } from '../utils/formatters';

interface AttractionSectionProps {
  attractions: Attraction[];
  currency: Currency;
  onToggleAttraction?: (attractionId: string) => void;
}

export const AttractionCard: React.FC<AttractionSectionProps> = ({
  attractions,
  currency,
  onToggleAttraction
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-md p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-bold mb-2">
            <Ticket className="w-3.5 h-3.5" />
            Handpicked Experiences
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Places to Visit & Activities
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Carefully curated to match your preferred travel style while keeping entry and transit costs low.
          </p>
        </div>

        <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
          Showing {attractions.length} prioritized sights
        </div>
      </div>

      {/* Attractions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {attractions.map((attraction) => {
          const isIncluded = attraction.included !== false;

          return (
            <div
              key={attraction.id}
              className={`rounded-3xl border transition-all duration-300 overflow-hidden flex flex-col justify-between ${
                isIncluded
                  ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-800/40 opacity-70'
              }`}
            >
              <div>
                {/* Photo & Category */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={attraction.image}
                    alt={attraction.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />

                  {/* Category Pill */}
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20">
                      {attraction.category}
                    </span>
                  </div>

                  {/* Entry Fee overlay */}
                  <div className="absolute top-3 right-3 bg-emerald-600/90 text-white backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-black shadow-md">
                    {attraction.entryFee === 0 ? 'FREE Entry' : `🎟️ ${formatCurrency(attraction.entryFee, currency)}`}
                  </div>

                  {/* Title overlay */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h4 className="font-black text-lg leading-snug drop-shadow-sm">
                      {attraction.name}
                    </h4>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 sm:p-5 space-y-3">
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {attraction.description}
                  </p>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>{attraction.recommendedTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                      <Navigation className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span>Transit: {formatCurrency(attraction.approxTravelCost, currency)}</span>
                    </div>
                    <div className="col-span-2 flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px] pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
                      <MapPin className="w-3 h-3 text-emerald-500 shrink-0" />
                      <span>Distance: {attraction.distanceFromHotel}</span>
                    </div>
                  </div>

                  {/* Match Reason */}
                  {attraction.matchReason && (
                    <div className="text-[11px] text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
                      ✨ <strong>Why included:</strong> {attraction.matchReason}
                    </div>
                  )}
                </div>
              </div>

              {/* Toggle in plan */}
              {onToggleAttraction && (
                <div className="p-4 sm:p-5 pt-0">
                  <button
                    type="button"
                    onClick={() => onToggleAttraction(attraction.id)}
                    className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isIncluded
                        ? 'border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                    }`}
                  >
                    {isIncluded ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        Included in Trip Budget
                      </>
                    ) : (
                      <>
                        <span>+ Add Back to Trip</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
