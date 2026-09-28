import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Lightbulb, Plus, Check, Compass, Edit3 } from 'lucide-react';
import { DayItinerary, Currency } from '../types/travel';
import { formatCurrency } from '../utils/formatters';

interface ItineraryProps {
  itinerary: DayItinerary[];
  currency: Currency;
  onAddActivity?: (dayNumber: number, activity: any) => void;
}

export const Itinerary: React.FC<ItineraryProps> = ({
  itinerary,
  currency,
  onAddActivity
}) => {
  const [activeDay, setActiveDay] = useState<number>(1);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newTime, setNewTime] = useState<string>('02:00 PM');
  const [newCost, setNewCost] = useState<number>(200);
  const [newLoc, setNewLoc] = useState<string>('');

  const currentDayPlan = itinerary.find(d => d.day === activeDay) || itinerary[0];

  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    if (onAddActivity) {
      onAddActivity(activeDay, {
        time: newTime,
        title: newTitle,
        icon: '📍',
        description: 'Custom activity added by traveler',
        estimatedCost: Number(newCost) || 0,
        location: newLoc || 'Local spot'
      });
    }
    setNewTitle('');
    setNewLoc('');
    setShowAddModal(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-md p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-2">
            <Calendar className="w-3.5 h-3.5" />
            AI Day-by-Day Itinerary
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Optimized Schedule & Sightseeing Route
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Organized geographically to eliminate backtracking and cut down unnecessary transport costs.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 text-emerald-500" />
          Add Custom Activity
        </button>
      </div>

      {/* Day Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {itinerary.map((day) => {
          const isActive = day.day === activeDay;
          return (
            <button
              key={day.day}
              type="button"
              onClick={() => setActiveDay(day.day)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 ring-2 ring-emerald-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Day {day.day}: {day.theme}
            </button>
          );
        })}
      </div>

      {/* Active Day Card */}
      {currentDayPlan && (
        <div className="space-y-6">
          {/* Day Title & Smart Travel Tip */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-500 text-white text-xs flex items-center justify-center font-bold">
                  D{currentDayPlan.day}
                </span>
                {currentDayPlan.title}
              </h4>
              <span className="text-xs font-semibold text-slate-400">
                {currentDayPlan.activities.length} planned stops
              </span>
            </div>

            {currentDayPlan.travelTip && (
              <div className="flex items-start gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs text-emerald-800 dark:text-emerald-300">
                <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Geographic Savings Tip:</strong> {currentDayPlan.travelTip}
                </span>
              </div>
            )}
          </div>

          {/* Activities Timeline */}
          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
            {currentDayPlan.activities.map((act, idx) => (
              <div key={idx} className="relative group">
                {/* Timeline node */}
                <div className="absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border-2 border-emerald-500 flex items-center justify-center shadow-sm text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>

                <div className="bg-white dark:bg-slate-800/70 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors shadow-sm space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{act.icon || '📍'}</span>
                      <h5 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                        {act.title}
                      </h5>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <span className="font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {act.time}
                      </span>
                      <span className="font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                        {act.estimatedCost === 0 ? 'Free' : formatCurrency(act.estimatedCost, currency)}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {act.description}
                  </p>

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>Location: {act.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Custom Activity Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-700 shadow-2xl space-y-4">
            <h4 className="font-extrabold text-lg text-slate-900 dark:text-white">
              Add Activity to Day {activeDay}
            </h4>

            <form onSubmit={handleCreateActivity} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Activity Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sunset Boat Ride or Coffee Tasting"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Time</label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={e => setNewTime(e.target.value)}
                    placeholder="e.g. 03:00 PM"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Est. Cost (₹)</label>
                  <input
                    type="number"
                    value={newCost}
                    onChange={e => setNewCost(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Location / District</label>
                <input
                  type="text"
                  placeholder="e.g. Waterfront Promenade"
                  value={newLoc}
                  onChange={e => setNewLoc(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-600/20 hover:bg-emerald-500"
                >
                  Save Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
