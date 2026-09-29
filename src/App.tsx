import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Bookmark, Download, Share2, Sparkles, Printer, 
  CheckCircle, RefreshCw, Compass, Plus, Eye 
} from 'lucide-react';
import confetti from 'canvas-confetti';

import { 
  DestinationPlan, UserInput, Currency, SavedTrip, CheaperSuggestion 
} from './types/travel';
import { 
  CURATED_DESTINATION_TEMPLATES 
} from './data/curatedDestinations';
import { 
  getSavedTrips, saveTripToStorage, removeTripFromStorage, 
  getFavorites, toggleFavorite, recordSearchHistory, getSearchHistory, 
  formatCurrency, STORAGE_KEYS 
} from './utils/formatters';

import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { BudgetForm } from './components/BudgetForm';
import { AgentActivity } from './components/AgentActivity';
import { DestinationCard } from './components/DestinationCard';
import { BudgetBreakdown } from './components/BudgetBreakdown';
import { TransportCard } from './components/TransportCard';
import { HotelCard } from './components/HotelCard';
import { AttractionCard } from './components/AttractionCard';
import { Itinerary } from './components/Itinerary';
import { BudgetOptimizer } from './components/BudgetOptimizer';
import { BudgetAlert } from './components/BudgetAlert';
import { DestinationComparison } from './components/DestinationComparison';
import { Dashboard } from './components/Dashboard';
import { AIChat } from './components/AIChat';

export default function App() {
  // Navigation & View state
  const [currentTab, setCurrentTab] = useState<'landing' | 'plan' | 'compare' | 'dashboard'>('landing');
  const [plannerStep, setPlannerStep] = useState<'form' | 'processing' | 'results' | 'detail'>('form');

  // Preferences & Currency
  const [currency, setCurrency] = useState<Currency>('INR');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.THEME) === 'dark';
    } catch {
      return false;
    }
  });

  // User Trip Input
  const [userInput, setUserInput] = useState<UserInput>({
    budget: 40000,
    budgetType: 'total',
    currency: 'INR',
    adults: 1,
    children: 0,
    days: 5,
    fromCity: 'Mumbai',
    fromCountry: 'India',
    travelMonth: 'Flexible',
    preferences: ['Food', 'Culture', 'Nature', 'Adventure'],
    referenceTrip: 'Something similar to Thailand but cheaper'
  });

  // Recommended Destinations & Active Selection
  const [destinations, setDestinations] = useState<DestinationPlan[]>(CURATED_DESTINATION_TEMPLATES);
  const [selectedDestination, setSelectedDestination] = useState<DestinationPlan>(CURATED_DESTINATION_TEMPLATES[0]);
  const [comparedDestinations, setComparedDestinations] = useState<DestinationPlan[]>([
    CURATED_DESTINATION_TEMPLATES[0],
    CURATED_DESTINATION_TEMPLATES[1],
    CURATED_DESTINATION_TEMPLATES[2]
  ]);

  // Saved Trips & Favorites
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>(getSavedTrips);
  const [favorites, setFavorites] = useState<string[]>(getFavorites);
  const [searchHistory, setSearchHistory] = useState<UserInput[]>(getSearchHistory);
  const [saveBanner, setSaveBanner] = useState<string | null>(null);

  // Sync Dark Mode class with <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(STORAGE_KEYS.THEME, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(STORAGE_KEYS.THEME, 'light');
    }
  }, [darkMode]);

  // Helper to dynamically scale and calibrate destination models
  const applyScaledDestinations = (input: UserInput) => {
    const adults = Number(input.adults) || 1;
    const children = Number(input.children) || 0;
    const totalTravelers = adults + (children * 0.75);
    const rooms = Math.max(1, Math.ceil((adults + children) / 2));
    const nights = Math.max(1, input.days - 1);
    const dayRatio = nights / 4; // standard 5 days baseline = 4 nights

    const scaled = CURATED_DESTINATION_TEMPLATES.map(dest => {
      const scaledFlights = Math.round(dest.breakdown.flights * totalTravelers);
      const scaledHotels = Math.round(dest.breakdown.hotels * rooms * Math.max(0.6, dayRatio));
      const scaledTransport = Math.round((dest.breakdown.localTransport / 5) * totalTravelers * input.days);
      const scaledFood = Math.round((dest.breakdown.food / 5) * totalTravelers * input.days);
      const scaledActivities = Math.round((dest.breakdown.activities / 5) * totalTravelers * input.days);
      const scaledEmergency = Math.round((scaledFlights + scaledHotels + scaledTransport + scaledFood + scaledActivities) * 0.08);

      const totalEst = scaledFlights + scaledHotels + scaledTransport + scaledFood + scaledActivities + scaledEmergency;
      const budgetFit: 'within' | 'exceeds' = totalEst <= input.budget ? 'within' : 'exceeds';
      const prefMatches = dest.travelStyles.filter(s => input.preferences.includes(s)).length;

      return {
        ...dest,
        estimatedTotal: totalEst,
        recommendedDuration: input.days,
        budgetFit,
        breakdown: {
          flights: scaledFlights,
          hotels: scaledHotels,
          localTransport: scaledTransport,
          food: scaledFood,
          activities: scaledActivities,
          emergencyMisc: scaledEmergency,
          total: totalEst
        },
        _matchScore: prefMatches
      };
    }).sort((a, b) => {
      // Prioritize within-budget destinations, then highest preference match
      if (a.budgetFit === 'within' && b.budgetFit !== 'within') return -1;
      if (b.budgetFit === 'within' && a.budgetFit !== 'within') return 1;
      return (b as any)._matchScore - (a as any)._matchScore;
    });

    setDestinations(scaled);
    setSelectedDestination(scaled[0]);
    setComparedDestinations(scaled.slice(0, 3));
  };

  // Handle Form Submission from BudgetForm
  const handleFormSubmit = async (input: UserInput) => {
    setUserInput(input);
    recordSearchHistory(input);
    setSearchHistory(getSearchHistory());
    setPlannerStep('processing');
    setCurrentTab('plan');

    // Pre-apply scaled destinations right away so UI is always responsive
    applyScaledDestinations(input);

    try {
      const response = await fetch('/api/recommend-destinations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.destinations && data.destinations.length > 0) {
          setDestinations(data.destinations);
          setSelectedDestination(data.destinations[0]);
          setComparedDestinations(data.destinations.slice(0, 3));
        }
      }
    } catch (e) {
      console.warn('Backend live synthesis busy, utilizing calibrated intelligence engine', e);
    }
  };

  // Called when agent animation completes
  const handleAgentCompleted = () => {
    setPlannerStep('results');
  };

  // Open Full Plan Detail
  const handleViewPlan = (dest: DestinationPlan) => {
    setSelectedDestination(dest);
    setPlannerStep('detail');
    setCurrentTab('plan');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Quick Preset Click from Landing Page
  const handleQuickPreset = (budget: number, days: number, preferences: string[]) => {
    const updated: UserInput = {
      ...userInput,
      budget,
      days,
      preferences
    };
    setUserInput(updated);
    handleFormSubmit(updated);
  };

  // Recalculate trip budget when a hotel is changed
  const handleHotelSelection = (hotelId: string) => {
    if (!selectedDestination) return;
    const hotel = selectedDestination.hotels.find(h => h.id === hotelId);
    if (!hotel) return;

    const adults = Number(userInput.adults) || 1;
    const children = Number(userInput.children) || 0;
    const rooms = Math.max(1, Math.ceil((adults + children) / 2));
    const totalNights = Math.max(1, selectedDestination.recommendedDuration - 1);
    const newHotelCost = hotel.pricePerNight * totalNights * rooms;
    const diff = newHotelCost - selectedDestination.breakdown.hotels;

    const updatedBreakdown = {
      ...selectedDestination.breakdown,
      hotels: newHotelCost,
      total: selectedDestination.breakdown.total + diff
    };

    const updatedDestination: DestinationPlan = {
      ...selectedDestination,
      selectedHotelId: hotelId,
      breakdown: updatedBreakdown,
      estimatedTotal: updatedBreakdown.total,
      budgetFit: updatedBreakdown.total <= userInput.budget ? 'within' : 'exceeds'
    };

    setSelectedDestination(updatedDestination);
    setDestinations(prev => prev.map(d => d.id === updatedDestination.id ? updatedDestination : d));
  };

  // Toggle Attraction Inclusion
  const handleToggleAttraction = (attractionId: string) => {
    if (!selectedDestination) return;
    const attraction = selectedDestination.attractions.find(a => a.id === attractionId);
    if (!attraction) return;

    const currentlyIncluded = attraction.included !== false;
    const feeChange = currentlyIncluded ? -attraction.entryFee : attraction.entryFee;

    const updatedAttractions = selectedDestination.attractions.map(a =>
      a.id === attractionId ? { ...a, included: !currentlyIncluded } : a
    );

    const updatedBreakdown = {
      ...selectedDestination.breakdown,
      activities: Math.max(0, selectedDestination.breakdown.activities + feeChange),
      total: selectedDestination.breakdown.total + feeChange
    };

    const updatedDestination: DestinationPlan = {
      ...selectedDestination,
      attractions: updatedAttractions,
      breakdown: updatedBreakdown,
      estimatedTotal: updatedBreakdown.total,
      budgetFit: updatedBreakdown.total <= userInput.budget ? 'within' : 'exceeds'
    };

    setSelectedDestination(updatedDestination);
  };

  // Apply Savings from "Make It Cheaper" Optimizer
  const handleApplySavings = (savings: number, updatedSuggestions: CheaperSuggestion[]) => {
    if (!selectedDestination) return;
    const newTotal = Math.max(5000, selectedDestination.estimatedTotal - savings);
    
    // Proportionally deduct from hotels, transport, activities
    const updatedBreakdown = {
      ...selectedDestination.breakdown,
      hotels: Math.max(2000, selectedDestination.breakdown.hotels - Math.round(savings * 0.4)),
      localTransport: Math.max(1000, selectedDestination.breakdown.localTransport - Math.round(savings * 0.3)),
      activities: Math.max(1000, selectedDestination.breakdown.activities - Math.round(savings * 0.3)),
      total: newTotal
    };

    const updatedDestination: DestinationPlan = {
      ...selectedDestination,
      estimatedTotal: newTotal,
      breakdown: updatedBreakdown,
      cheaperSuggestions: updatedSuggestions,
      budgetFit: newTotal <= userInput.budget ? 'within' : 'exceeds'
    };

    setSelectedDestination(updatedDestination);
    setSaveBanner(`Applied ${formatCurrency(savings, currency)} savings! Your trip budget is updated.`);
    setTimeout(() => setSaveBanner(null), 4000);
  };

  // Save Trip Action
  const handleSaveTrip = () => {
    if (!selectedDestination) return;
    saveTripToStorage(selectedDestination, userInput);
    setSavedTrips(getSavedTrips());
    setSaveBanner(`✓ "${selectedDestination.country}" saved to your Travel Dashboard!`);
    setTimeout(() => setSaveBanner(null), 3500);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {
      // no-op
    }
  };

  // Toggle Favorite
  const handleToggleFavorite = (destId: string) => {
    toggleFavorite(destId);
    setFavorites(getFavorites());
  };

  // Toggle Compare
  const handleToggleCompare = (dest: DestinationPlan) => {
    if (comparedDestinations.some(d => d.id === dest.id)) {
      setComparedDestinations(prev => prev.filter(d => d.id !== dest.id));
    } else {
      if (comparedDestinations.length >= 4) {
        setComparedDestinations(prev => [...prev.slice(1), dest]);
      } else {
        setComparedDestinations(prev => [...prev, dest]);
      }
    }
  };

  // Share Trip Handler
  const handleShareTrip = () => {
    const text = `Take a look at my AI-budget trip to ${selectedDestination.country} for ${formatCurrency(selectedDestination.estimatedTotal, currency)}!`;
    if (navigator.share) {
      navigator.share({
        title: `${selectedDestination.country} Budget Plan`,
        text: text,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${text} - ${window.location.href}`);
      setSaveBanner('Share link copied to clipboard!');
      setTimeout(() => setSaveBanner(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currency={currency}
        setCurrency={setCurrency}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        savedCount={savedTrips.length}
        onNewTrip={() => {
          setCurrentTab('plan');
          setPlannerStep('form');
        }}
      />

      {/* Global Toast Notification */}
      {saveBanner && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-2xl shadow-xl animate-in fade-in slide-in-from-top-4 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{saveBanner}</span>
        </div>
      )}

      {/* MAIN VIEW SWITCHER */}
      <main className="flex-1">
        {/* VIEW 1: LANDING PAGE */}
        {currentTab === 'landing' && (
          <LandingPage
            destinations={destinations}
            currency={currency}
            onStartPlanning={() => {
              setCurrentTab('plan');
              setPlannerStep('form');
            }}
            onQuickPreset={handleQuickPreset}
            onSelectDestination={handleViewPlan}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {/* VIEW 2: TRIP PLANNER */}
        {currentTab === 'plan' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Step 1: Form */}
            {plannerStep === 'form' && (
              <BudgetForm
                initialInput={userInput}
                currency={currency}
                onSubmit={handleFormSubmit}
                onCancel={() => setCurrentTab('landing')}
              />
            )}

            {/* Step 2: Animated AI Processing */}
            {plannerStep === 'processing' && (
              <AgentActivity
                userInput={userInput}
                currency={currency}
                onComplete={handleAgentCompleted}
              />
            )}

            {/* Step 3: Destination Recommendations Results */}
            {plannerStep === 'results' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-2">
                      <Sparkles className="w-3.5 h-3.5" />
                      AI Analysis Complete
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                      Recommended Destinations for Your Budget
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Matched to your {formatCurrency(userInput.budget, currency)} budget from {userInput.fromCity} for {userInput.days} days.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPlannerStep('form')}
                      className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      Adjust Search
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentTab('compare')}
                      className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold cursor-pointer"
                    >
                      Compare Matrix
                    </button>
                  </div>
                </div>

                {/* Destinations Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {destinations.map((dest) => (
                    <DestinationCard
                      key={dest.id}
                      destination={dest}
                      currency={currency}
                      userBudget={userInput.budget}
                      isFavorite={favorites.includes(dest.id)}
                      isComparing={comparedDestinations.some(d => d.id === dest.id)}
                      onSelect={() => handleViewPlan(dest)}
                      onToggleFavorite={() => handleToggleFavorite(dest.id)}
                      onToggleCompare={() => handleToggleCompare(dest)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Comprehensive Destination Plan Detail */}
            {plannerStep === 'detail' && selectedDestination && (
              <div className="space-y-8 animate-in fade-in duration-300">
                {/* Back and Action Toolbar */}
                <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setPlannerStep('results')}
                    className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Recommended Countries
                  </button>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSaveTrip}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-sm"
                    >
                      <Bookmark className="w-3.5 h-3.5 text-emerald-500" />
                      Save Trip
                    </button>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-sm"
                    >
                      <Printer className="w-3.5 h-3.5 text-sky-500" />
                      Download PDF
                    </button>
                    <button
                      type="button"
                      onClick={handleShareTrip}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-sm"
                    >
                      <Share2 className="w-3.5 h-3.5 text-indigo-500" />
                      Share
                    </button>
                  </div>
                </div>

                {/* Budget Alert if exceeding */}
                <BudgetAlert
                  userBudget={userInput.budget}
                  estimatedTotal={selectedDestination.estimatedTotal}
                  currency={currency}
                  onOpenOptimizer={() => {
                    const optimizerElem = document.getElementById('optimizer-section');
                    optimizerElem?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  onSwitchAlternative={() => setPlannerStep('results')}
                />

                {/* Complete Trip Budget Breakdown */}
                <BudgetBreakdown
                  destination={selectedDestination}
                  currency={currency}
                  userBudget={userInput.budget}
                />

                {/* "Make It Cheaper" AI Agent */}
                <div id="optimizer-section">
                  <BudgetOptimizer
                    destination={selectedDestination}
                    currency={currency}
                    userBudget={userInput.budget}
                    onApplySavings={handleApplySavings}
                  />
                </div>

                {/* Transportation Section */}
                <TransportCard
                  transport={selectedDestination.transport}
                  currency={currency}
                  fromCity={userInput.fromCity}
                  destinationCountry={selectedDestination.country}
                  primaryCity={selectedDestination.primaryCity}
                />

                {/* Hotel Recommendations */}
                <HotelCard
                  hotels={selectedDestination.hotels}
                  selectedHotelId={selectedDestination.selectedHotelId}
                  totalNights={selectedDestination.recommendedDuration - 1}
                  currency={currency}
                  onSelectHotel={handleHotelSelection}
                />

                {/* Places to Visit */}
                <AttractionCard
                  attractions={selectedDestination.attractions}
                  currency={currency}
                  onToggleAttraction={handleToggleAttraction}
                />

                {/* Day-by-Day Itinerary */}
                <Itinerary
                  itinerary={selectedDestination.itinerary}
                  currency={currency}
                />
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: DESTINATION COMPARISON */}
        {currentTab === 'compare' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <DestinationComparison
              destinations={destinations}
              selectedDestinations={comparedDestinations}
              currency={currency}
              userBudget={userInput.budget}
              onSelectDestination={handleViewPlan}
              onRemoveFromCompare={(id) => {
                setComparedDestinations(prev => prev.filter(d => d.id !== id));
              }}
            />
          </div>
        )}

        {/* VIEW 4: DASHBOARD */}
        {currentTab === 'dashboard' && (
          <Dashboard
            savedTrips={savedTrips}
            favorites={favorites}
            destinations={destinations}
            searchHistory={searchHistory}
            currency={currency}
            onOpenTrip={(trip) => {
              setSelectedDestination(trip.destination);
              setUserInput(trip.userInput);
              setCurrentTab('plan');
              setPlannerStep('detail');
            }}
            onSelectDestination={handleViewPlan}
            onRerunSearch={(hist) => {
              setUserInput(hist);
              handleFormSubmit(hist);
            }}
            onDeleteSavedTrip={(id) => {
              removeTripFromStorage(id);
              setSavedTrips(getSavedTrips());
            }}
          />
        )}
      </main>

      {/* Floating AI Travel Assistant */}
      <AIChat
        currentDestination={selectedDestination}
        userInput={userInput}
        currency={currency}
        onApplySavings={() => {
          const optimizerElem = document.getElementById('optimizer-section');
          optimizerElem?.scrollIntoView({ behavior: 'smooth' });
        }}
        onSelectBudgetHotel={() => {
          if (selectedDestination?.hotels?.[0]) {
            handleHotelSelection(selectedDestination.hotels[0].id);
          }
        }}
        onAddDay={() => {
          const updatedDays = userInput.days + 1;
          setUserInput(prev => ({ ...prev, days: updatedDays }));
        }}
      />

      {/* Footer */}
      <footer className="no-print bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 px-4 text-center text-xs text-slate-500 dark:text-slate-400 space-y-2 mt-auto">
        <div className="flex items-center justify-center gap-2 font-bold text-slate-800 dark:text-slate-200">
          <span>BudgetTrip AI</span>
          <span>•</span>
          <span>Your Budget. Your Trip. AI Planned.</span>
        </div>
        <p className="max-w-md mx-auto opacity-75">
          Transportation and hotel rates are estimated based on seasonal historic benchmarks. Please verify final ticket availability prior to booking.
        </p>
      </footer>
    </div>
  );
}
