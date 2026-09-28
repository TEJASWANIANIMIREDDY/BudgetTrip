import React, { useState } from 'react';
import { Bookmark, Clock, Heart, Download, Share2, Trash2, ArrowRight, MapPin, Calendar, ExternalLink, Sparkles, Printer } from 'lucide-react';
import { SavedTrip, DestinationPlan, UserInput, Currency } from '../types/travel';
import { formatCurrency, removeTripFromStorage } from '../utils/formatters';

interface DashboardProps {
  savedTrips: SavedTrip[];
  favorites: string[];
  destinations: DestinationPlan[];
  searchHistory: UserInput[];
  currency: Currency;
  onOpenTrip: (trip: SavedTrip) => void;
  onSelectDestination: (dest: DestinationPlan) => void;
  onRerunSearch: (input: UserInput) => void;
  onDeleteSavedTrip: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  savedTrips,
  favorites,
  destinations,
  searchHistory,
  currency,
  onOpenTrip,
  onSelectDestination,
  onRerunSearch,
  onDeleteSavedTrip
}) => {
  const [activeTab, setActiveTab] = useState<'trips' | 'favorites' | 'history'>('trips');
  const [shareSuccessMessage, setShareSuccessMessage] = useState<string | null>(null);

  const favoriteDestinations = destinations.filter(d => favorites.includes(d.id));

  const handleShare = (tripTitle: string, country: string, cost: number) => {
    const shareText = `Check out my ${country} travel itinerary planned on BudgetTrip AI for ${formatCurrency(cost, currency)}!`;
    if (navigator.share) {
      navigator.share({
        title: 'BudgetTrip AI Itinerary',
        text: shareText,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${shareText} - ${window.location.href}`);
      setShareSuccessMessage('Share link copied to clipboard!');
      setTimeout(() => setShareSuccessMessage(null), 3000);
    }
  };

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-2">
            <Bookmark className="w-3.5 h-3.5" />
            Travel Workspace
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">
            My Travel Dashboard
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Access your saved trip blueprints, bookmarked destinations, and past travel searches.
          </p>
        </div>

        {/* Global Print / Export button */}
        <button
          type="button"
          onClick={handlePrintPdf}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs shadow-sm cursor-pointer transition-all"
        >
          <Printer className="w-4 h-4 text-emerald-500" />
          Download / Print Itinerary
        </button>
      </div>

      {shareSuccessMessage && (
        <div className="p-3 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 rounded-xl text-xs font-bold text-center animate-in fade-in">
          ✓ {shareSuccessMessage}
        </div>
      )}

      {/* Internal Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setActiveTab('trips')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'trips'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Saved Trips ({savedTrips.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('favorites')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'favorites'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Wishlisted Countries ({favoriteDestinations.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'history'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Recent Searches ({searchHistory.length})
        </button>
      </div>

      {/* TAB 1: SAVED TRIPS */}
      {activeTab === 'trips' && (
        <div>
          {savedTrips.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-8 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center mx-auto text-2xl">
                ✈️
              </div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                No saved trips yet
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore recommended destinations and click &quot;Save Trip&quot; to keep your customized itineraries here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedTrips.map((st) => (
                <div
                  key={st.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="relative h-44">
                    <img
                      src={st.destination.heroImage}
                      alt={st.destination.country}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                    
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleShare(st.destination.tagline, st.destination.country, st.destination.estimatedTotal)}
                        className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center transition-colors cursor-pointer"
                        title="Share trip"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteSavedTrip(st.id)}
                        className="w-8 h-8 rounded-full bg-black/50 hover:bg-red-600 backdrop-blur-md text-white flex items-center justify-center transition-colors cursor-pointer"
                        title="Delete saved trip"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <span className="text-xl">{st.destination.flagEmoji}</span>
                      <h4 className="font-black text-xl leading-tight">
                        {st.destination.country}
                      </h4>
                      <p className="text-xs text-slate-300 opacity-90">
                        {st.userInput.days} Days • {st.userInput.adults + st.userInput.children} travelers
                      </p>
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-400 block font-medium">Estimated Budget</span>
                        <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(st.destination.estimatedTotal, currency)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-400 block font-medium">Departure</span>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          {st.userInput.fromCity}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => onOpenTrip(st)}
                        className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <span>Open Itinerary</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: FAVORITES */}
      {activeTab === 'favorites' && (
        <div>
          {favoriteDestinations.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-8 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-500 flex items-center justify-center mx-auto text-2xl">
                ❤️
              </div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                No favorites bookmarked
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Heart any country card while browsing to save it to your wishlist.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteDestinations.map(dest => (
                <div
                  key={dest.id}
                  onClick={() => onSelectDestination(dest)}
                  className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={dest.heroImage}
                      alt={dest.country}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <span className="text-xl">{dest.flagEmoji}</span>
                      <h4 className="font-black text-xl">{dest.country}</h4>
                      <p className="text-xs text-slate-300">{dest.tagline}</p>
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 block">Est. Cost</span>
                      <span className="font-extrabold text-slate-900 dark:text-white text-base">
                        {formatCurrency(dest.estimatedTotal, currency)}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      View Details →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: RECENT SEARCHES */}
      {activeTab === 'history' && (
        <div className="space-y-3">
          {searchHistory.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-500">
              No recent searches recorded yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchHistory.map((hist, idx) => (
                <div
                  key={idx}
                  onClick={() => onRerunSearch(hist)}
                  className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/60 transition-all cursor-pointer flex items-center justify-between shadow-sm group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                      <span>✈️ From {hist.fromCity}</span>
                      <span className="text-slate-400">•</span>
                      <span>{hist.days} Days</span>
                    </div>
                    <div className="text-xs text-emerald-600 dark:text-emerald-400 font-extrabold">
                      Budget: {formatCurrency(hist.budget, currency)}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate max-w-[200px]">
                      Styles: {(hist.preferences || []).join(', ') || 'General'}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
