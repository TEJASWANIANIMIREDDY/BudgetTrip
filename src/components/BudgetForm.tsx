import React, { useState } from 'react';
import { 
  Wallet, Users, Calendar, MapPin, Heart, Sparkles, 
  ArrowRight, ArrowLeft, Check, Compass, Info, DollarSign
} from 'lucide-react';
import { UserInput, Currency } from '../types/travel';
import { formatCurrency } from '../utils/formatters';
import { POPULAR_ORIGIN_CITIES, TRAVEL_PREFERENCES_LIST, REFERENCE_PRESETS } from '../data/curatedDestinations';

interface BudgetFormProps {
  initialInput: UserInput;
  currency: Currency;
  onSubmit: (input: UserInput) => void;
  onCancel?: () => void;
}

export const BudgetForm: React.FC<BudgetFormProps> = ({
  initialInput,
  currency,
  onSubmit,
  onCancel
}) => {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<UserInput>(initialInput);

  const budgetPresets = [20000, 30000, 50000, 100000, 200000];
  const durationPresets = [3, 5, 7, 10, 14];
  const months = [
    'Flexible', 'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePreferenceToggle = (pref: string) => {
    setFormData(prev => {
      const exists = prev.preferences.includes(pref);
      return {
        ...prev,
        preferences: exists
          ? prev.preferences.filter(p => p !== pref)
          : [...prev.preferences, pref]
      };
    });
  };

  const handleNext = () => {
    if (step < 6) {
      setStep(s => s + 1);
    } else {
      onSubmit(formData);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(s => s - 1);
    } else if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden max-w-3xl mx-auto transition-all">
      {/* Step Progress Header */}
      <div className="bg-slate-50 dark:bg-slate-800/60 px-6 py-5 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
              {step}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Step {step} of 6
            </span>
          </div>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {step === 1 && 'Trip Budget'}
            {step === 2 && 'Travelers'}
            {step === 3 && 'Duration'}
            {step === 4 && 'Starting City'}
            {step === 5 && 'Travel Style'}
            {step === 6 && 'Reference & Month'}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full transition-all duration-300 rounded-full"
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6 sm:p-8">
        {/* STEP 1: BUDGET */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-2">
                <Wallet className="w-3.5 h-3.5" /> Step 1: Financial Scope
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                What is your total travel budget?
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Enter your total available spending cap. We will factor in flights, stays, food, and sightseeing realistically.
              </p>
            </div>

            {/* Quick Presets */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {budgetPresets.map(preset => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setFormData({ ...formData, budget: preset })}
                  className={`py-3 px-3 rounded-2xl text-center text-sm font-bold border transition-all cursor-pointer ${
                    formData.budget === preset
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {formatCurrency(preset, currency)}
                </button>
              ))}
            </div>

            {/* Custom Amount Input */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Or enter custom budget ({currency})
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 font-bold text-lg">
                  ₹
                </div>
                <input
                  type="number"
                  min="5000"
                  step="1000"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: Math.max(0, Number(e.target.value)) })}
                  className="w-full pl-10 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-xl font-extrabold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="e.g. 45000"
                />
              </div>

              {/* Slider for smooth adjustment */}
              <input
                type="range"
                min="10000"
                max="300000"
                step="5000"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                className="w-full accent-emerald-500 cursor-pointer"
              />

              {/* Budget Scope Clarification */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <Info className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>This is considered the <strong>total trip budget for all travelers</strong> combined.</span>
                </div>
                <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, budgetType: 'total' })}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                      formData.budgetType === 'total'
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    Total All
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, budgetType: 'per_person' })}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                      formData.budgetType === 'per_person'
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    Per Person
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: TRAVELERS */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-2">
                <Users className="w-3.5 h-3.5" /> Step 2: Party Size
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Who is traveling?
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Hotel rooms and flight ticket counts scale based on total adult and child travelers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Adults Counter */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Adults</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Age 12 and above</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, adults: Math.max(1, formData.adults - 1) })}
                    className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-bold text-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 flex items-center justify-center transition-all cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-extrabold text-xl text-slate-900 dark:text-white w-6 text-center">
                    {formData.adults}
                  </span>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, adults: Math.min(10, formData.adults + 1) })}
                    className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-bold text-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 flex items-center justify-center transition-all cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Children Counter */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Children</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Age 0–11 years</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, children: Math.max(0, formData.children - 1) })}
                    className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-bold text-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 flex items-center justify-center transition-all cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-extrabold text-xl text-slate-900 dark:text-white w-6 text-center">
                    {formData.children}
                  </span>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, children: Math.min(8, formData.children + 1) })}
                    className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-bold text-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 flex items-center justify-center transition-all cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>
                Total <strong>{formData.adults + formData.children} travelers</strong>. Your budget gives approx{' '}
                <strong>{formatCurrency(Math.round(formData.budget / Math.max(1, formData.adults + formData.children)), currency)}</strong> per person.
              </span>
            </div>
          </div>
        )}

        {/* STEP 3: DURATION */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-2">
                <Calendar className="w-3.5 h-3.5" /> Step 3: Trip Length
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                How many days do you want to travel?
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Choose the number of days. The AI optimizes hotel nights and daily activity costs accordingly.
              </p>
            </div>

            {/* Quick Presets */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {durationPresets.map(days => (
                <button
                  type="button"
                  key={days}
                  onClick={() => setFormData({ ...formData, days })}
                  className={`py-4 px-3 rounded-2xl text-center border transition-all cursor-pointer ${
                    formData.days === days
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <div className="text-xl font-extrabold">{days} Days</div>
                  <div className="text-xs opacity-70 mt-0.5">{days - 1} Nights</div>
                </button>
              ))}
            </div>

            {/* Custom Days Input */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Custom Duration</span>
                <p className="text-xs text-slate-500 dark:text-slate-400">Select any length between 2 to 30 days</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="2"
                  max="30"
                  value={formData.days}
                  onChange={(e) => setFormData({ ...formData, days: Math.max(2, Math.min(30, Number(e.target.value))) })}
                  className="w-20 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-center font-extrabold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Days</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: STARTING LOCATION */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-2">
                <MapPin className="w-3.5 h-3.5" /> Step 4: Origin
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Where are you travelling from?
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Flight and transportation costs are calculated directly from your departure city.
              </p>
            </div>

            {/* Popular Origin Cities Chips */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Popular Hubs
              </label>
              <div className="flex flex-wrap gap-2">
                {POPULAR_ORIGIN_CITIES.map(loc => {
                  const isSelected = formData.fromCity.toLowerCase() === loc.city.toLowerCase();
                  return (
                    <button
                      type="button"
                      key={loc.city}
                      onClick={() => setFormData({ ...formData, fromCity: loc.city, fromCountry: loc.country })}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      ✈️ {loc.city}, {loc.country}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Input */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                  Departure City
                </label>
                <input
                  type="text"
                  value={formData.fromCity}
                  onChange={(e) => setFormData({ ...formData, fromCity: e.target.value })}
                  placeholder="e.g. Mumbai, New Delhi, Bengaluru"
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                  Departure Country
                </label>
                <input
                  type="text"
                  value={formData.fromCountry}
                  onChange={(e) => setFormData({ ...formData, fromCountry: e.target.value })}
                  placeholder="e.g. India"
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: TRAVEL PREFERENCES */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-2">
                <Heart className="w-3.5 h-3.5" /> Step 5: Travel Style
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                What are your travel preferences?
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Select all that appeal to you. We match attractions and country cultures to your desires.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {TRAVEL_PREFERENCES_LIST.map(pref => {
                const isSelected = formData.preferences.includes(pref.id);
                return (
                  <button
                    type="button"
                    key={pref.id}
                    onClick={() => handlePreferenceToggle(pref.id)}
                    className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{pref.icon}</span>
                      <span className="text-sm font-bold">{pref.label}</span>
                    </div>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <p className="text-xs text-slate-400 dark:text-slate-500">
              {formData.preferences.length === 0
                ? 'Tip: Select at least 1-2 styles for fine-tuned itineraries.'
                : `${formData.preferences.length} styles selected`}
            </p>
          </div>
        )}

        {/* STEP 6: REFERENCE DESTINATION & MONTH */}
        {step === 6 && (
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-2">
                <Compass className="w-3.5 h-3.5" /> Step 6: Benchmark & Timing
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Do you have a reference destination or trip?
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Tell us if you love a particular vibe (e.g. &quot;Like Thailand but cheaper&quot; or &quot;Bali aesthetic under ₹40,000&quot;).
              </p>
            </div>

            {/* Quick Inspiration Presets */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Click to Use Example Reference:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {REFERENCE_PRESETS.map((ref, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setFormData({ ...formData, referenceTrip: ref })}
                    className={`p-2.5 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                      formData.referenceTrip === ref
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 font-semibold'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    &ldquo;{ref}&rdquo;
                  </button>
                ))}
              </div>
            </div>

            {/* Free Text Reference */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Your Custom Reference or Trip Vision (Optional)
              </label>
              <textarea
                rows={2}
                value={formData.referenceTrip}
                onChange={(e) => setFormData({ ...formData, referenceTrip: e.target.value })}
                placeholder="e.g. I want something similar to Thailand but cheaper, with street food and green hills."
                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Travel Month Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Preferred Travel Month
              </label>
              <select
                value={formData.travelMonth}
                onChange={(e) => setFormData({ ...formData, travelMonth: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                {months.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-8 border-t border-slate-200 dark:border-slate-800 mt-6">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            {step === 1 ? (onCancel ? 'Cancel' : 'Home') : 'Back'}
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-bold shadow-lg shadow-emerald-600/25 active:scale-95 transition-all cursor-pointer"
          >
            {step === 6 ? (
              <>
                <Sparkles className="w-4 h-4" />
                Find Destinations For Me →
              </>
            ) : (
              <>
                Next Step
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
