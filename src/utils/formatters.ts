import { Currency, CURRENCIES, DestinationPlan, SavedTrip, UserInput } from '../types/travel';

export function formatCurrency(amountInINR: number, currency: Currency = 'INR'): string {
  const config = CURRENCIES[currency] || CURRENCIES.INR;
  const converted = Math.round(amountInINR * config.rate);
  
  if (currency === 'INR') {
    return `₹${converted.toLocaleString('en-IN')}`;
  } else if (currency === 'USD') {
    return `$${converted.toLocaleString('en-US')}`;
  } else if (currency === 'EUR') {
    return `€${converted.toLocaleString('de-DE')}`;
  } else if (currency === 'GBP') {
    return `£${converted.toLocaleString('en-GB')}`;
  } else if (currency === 'AED') {
    return `AED ${converted.toLocaleString('en-AE')}`;
  }
  return `${config.symbol}${converted.toLocaleString()}`;
}

export const STORAGE_KEYS = {
  SAVED_TRIPS: 'budgettrip_saved_trips',
  FAVORITES: 'budgettrip_favorites',
  SEARCH_HISTORY: 'budgettrip_search_history',
  SAVED_HOTELS: 'budgettrip_saved_hotels',
  THEME: 'budgettrip_theme'
};

export function getSavedTrips(): SavedTrip[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED_TRIPS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveTripToStorage(destination: DestinationPlan, userInput: UserInput): SavedTrip {
  const existing = getSavedTrips();
  const newTrip: SavedTrip = {
    id: `trip-${Date.now()}`,
    destination,
    userInput,
    savedAt: new Date().toISOString()
  };
  const updated = [newTrip, ...existing.filter(t => t.destination.id !== destination.id)];
  localStorage.setItem(STORAGE_KEYS.SAVED_TRIPS, JSON.stringify(updated));
  return newTrip;
}

export function removeTripFromStorage(id: string): void {
  const existing = getSavedTrips();
  const updated = existing.filter(t => t.id !== id);
  localStorage.setItem(STORAGE_KEYS.SAVED_TRIPS, JSON.stringify(updated));
}

export function getFavorites(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function toggleFavorite(destinationId: string): boolean {
  const favs = getFavorites();
  let updated: string[];
  let isFav = false;
  if (favs.includes(destinationId)) {
    updated = favs.filter(id => id !== destinationId);
  } else {
    updated = [...favs, destinationId];
    isFav = true;
  }
  localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated));
  return isFav;
}

export function recordSearchHistory(input: UserInput): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
    const history: UserInput[] = raw ? JSON.parse(raw) : [];
    const updated = [input, ...history.slice(0, 9)];
    localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(updated));
  } catch (e) {
    // ignore
  }
}

export function getSearchHistory(): UserInput[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}
