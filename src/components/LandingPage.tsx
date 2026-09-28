import React from 'react';
import { 
  Sparkles, ArrowRight, Compass, ShieldCheck, Wallet, 
  MapPin, CheckCircle, TrendingDown, Users, Calendar, Heart 
} from 'lucide-react';
import { DestinationPlan, Currency } from '../types/travel';
import { formatCurrency } from '../utils/formatters';
import { DestinationCard } from './DestinationCard';

interface LandingPageProps {
  destinations: DestinationPlan[];
  currency: Currency;
  onStartPlanning: () => void;
  onQuickPreset: (budget: number, days: number, pref: string[]) => void;
  onSelectDestination: (dest: DestinationPlan) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  destinations,
  currency,
  onStartPlanning,
  onQuickPreset,
  onSelectDestination,
  favorites,
  onToggleFavorite
}) => {
  return (
    <div className="space-y-20 pb-20">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Decorative background blurs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/15 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Tagline Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-bold shadow-sm mb-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
          <Sparkles className="w-4 h-4 text-emerald-500" />
          <span>Your Budget. Your Trip. AI Planned.</span>
        </div>

        {/* Hero Headings */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.08] max-w-4xl mx-auto">
          Where Can Your <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 bg-clip-text text-transparent">Budget</span> Take You?
        </h1>

        <p className="mt-6 text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Tell us your budget, travel dates and preferences. Our AI will discover affordable destinations and build your complete trip plan.
        </p>

        {/* Primary CTA button */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={onStartPlanning}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-base sm:text-lg shadow-xl shadow-emerald-600/30 hover:shadow-2xl hover:shadow-emerald-600/40 active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer group"
          >
            <span>Plan My Trip</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Quick Launch Preset Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Quick Ideas:</span>
          <button
            onClick={() => onQuickPreset(30000, 5, ['Food', 'Culture'])}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold hover:border-emerald-500 hover:text-emerald-600 transition-all cursor-pointer"
          >
            Under ₹30,000 (5 Days)
          </button>
          <button
            onClick={() => onQuickPreset(50000, 5, ['Beaches', 'Nature'])}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold hover:border-emerald-500 hover:text-emerald-600 transition-all cursor-pointer"
          >
            Beach Getaway under ₹50,000
          </button>
          <button
            onClick={() => onQuickPreset(25000, 5, ['Mountains', 'Adventure'])}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold hover:border-emerald-500 hover:text-emerald-600 transition-all cursor-pointer"
          >
            Himalayan Escape under ₹25,000
          </button>
        </div>
      </section>

      {/* FEATURED REAL-BUDGET DESTINATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
              <Compass className="w-3.5 h-3.5 text-emerald-500" />
              Realistically Affordable
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              Trending Budget Destinations
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Curated by our AI engine with verified flight, stay, and food cost benchmarks.
            </p>
          </div>

          <button
            type="button"
            onClick={onStartPlanning}
            className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:underline cursor-pointer"
          >
            Custom Budget Search →
          </button>
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((dest) => (
            <DestinationCard
              key={dest.id}
              destination={dest}
              currency={currency}
              userBudget={40000}
              isFavorite={favorites.includes(dest.id)}
              onSelect={() => onSelectDestination(dest)}
              onToggleFavorite={() => onToggleFavorite(dest.id)}
            />
          ))}
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="bg-slate-50 dark:bg-slate-900/60 py-16 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              The Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-1">
              How BudgetTrip AI Plans Your Trip
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              No unrealistic fantasy vacations. We evaluate exact purchasing power, transit connections, and local price levels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-xl">
                1
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Enter Budget & Travelers
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Specify your total cash ceiling, departure city, group size, and preferred vibe (e.g. &quot;Like Thailand but cheaper&quot;).
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center font-black text-xl">
                2
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                AI Budget Fit Engine
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Gemini AI computes estimated round-trip airfare, 3-tier hotel options, local buses, dining, and attraction passes.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center font-black text-xl">
                3
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                &ldquo;Make It Cheaper&rdquo; Optimizer
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                One-click agent scans transit hacks, alternative boutique stays, and free scenic trails to drop your cost even further.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <h3 className="text-3xl sm:text-4xl font-black tracking-tight">
              Ready to Discover Where Your Money Can Go?
            </h3>
            <p className="text-sm sm:text-base text-emerald-100 leading-relaxed">
              Don’t let uncertain travel costs hold you back. Build your customized, transparent itinerary in under 60 seconds.
            </p>
          </div>

          <button
            type="button"
            onClick={onStartPlanning}
            className="px-8 py-4 rounded-2xl bg-white text-emerald-700 hover:bg-slate-100 font-black text-base shadow-xl active:scale-95 transition-all cursor-pointer shrink-0"
          >
            Start Planning Now →
          </button>
        </div>
      </section>
    </div>
  );
};
