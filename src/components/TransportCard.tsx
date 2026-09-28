import React from 'react';
import { Plane, Train, Bus, Clock, MapPin, Lightbulb, Compass, Navigation } from 'lucide-react';
import { TransportOption, Currency } from '../types/travel';
import { formatCurrency } from '../utils/formatters';

interface TransportCardProps {
  transport: TransportOption;
  currency: Currency;
  fromCity: string;
  destinationCountry: string;
  primaryCity: string;
}

export const TransportCard: React.FC<TransportCardProps> = ({
  transport,
  currency,
  fromCity,
  destinationCountry,
  primaryCity
}) => {
  const getTransportIcon = (type: string) => {
    switch (type) {
      case 'train': return <Train className="w-5 h-5" />;
      case 'bus': return <Bus className="w-5 h-5" />;
      default: return <Plane className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-md p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 text-xs font-bold mb-2">
            <Navigation className="w-3.5 h-3.5" />
            Getting There & Moving Around
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>{fromCity || 'Origin'}</span>
            <span className="text-slate-400">→</span>
            <span>{primaryCity || destinationCountry}</span>
          </h3>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/80 px-4 py-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-700">
          <Clock className="w-4 h-4 text-sky-500" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            {transport.travelTime}
          </span>
        </div>
      </div>

      {/* Main Long Distance Transport Option */}
      <div className="bg-gradient-to-r from-sky-50/70 via-indigo-50/40 to-slate-50 dark:from-sky-950/30 dark:via-indigo-950/20 dark:to-slate-800/40 p-5 rounded-2xl border border-sky-100 dark:border-sky-900/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-sky-500/25">
              {getTransportIcon(transport.type)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                  Economical Primary Transit
                </span>
                <span className="text-[10px] bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-bold px-1.5 py-0.2 rounded">
                  Round-Trip
                </span>
              </div>
              <h4 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
                {transport.name}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {transport.route}
              </p>
            </div>
          </div>

          <div className="sm:text-right shrink-0">
            <span className="text-xs font-semibold text-slate-400 block">Est. Fare</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {formatCurrency(transport.cost, currency)}
            </span>
          </div>
        </div>

        {/* Booking Tip */}
        {transport.bookingTip && (
          <div className="mt-4 pt-3.5 border-t border-sky-200/50 dark:border-sky-900/40 flex items-start gap-2 text-xs text-sky-900 dark:text-sky-200">
            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span>
              <strong>Smart Booking Advice:</strong> {transport.bookingTip}
            </span>
          </div>
        )}
      </div>

      {/* Local Transportation Breakdown */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
          <span>🚇 Local Transit Options & Passes</span>
          <span className="text-slate-400 text-[10px] lowercase font-normal">(prioritizing economical routes)</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {transport.localTransportOptions.map((opt, idx) => (
            <div
              key={idx}
              className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800 flex flex-col justify-between space-y-2 hover:border-slate-300 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                    {opt.type}
                  </h5>
                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(opt.approxCost, currency)}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {opt.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
