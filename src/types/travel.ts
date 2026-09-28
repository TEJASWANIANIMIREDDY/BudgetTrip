export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED';

export interface CurrencyConfig {
  code: Currency;
  symbol: string;
  rateAgainstINR: number; // 1 INR in target currency (e.g. 1 INR = 0.012 USD)
}

export const CURRENCIES: Record<Currency, { symbol: string; rate: number; label: string }> = {
  INR: { symbol: '₹', rate: 1, label: 'Indian Rupee (₹)' },
  USD: { symbol: '$', rate: 0.012, label: 'US Dollar ($)' },
  EUR: { symbol: '€', rate: 0.011, label: 'Euro (€)' },
  GBP: { symbol: '£', rate: 0.0094, label: 'British Pound (£)' },
  AED: { symbol: 'AED ', rate: 0.044, label: 'UAE Dirham (AED)' }
};

export interface UserInput {
  budget: number;
  budgetType: 'total' | 'per_person';
  currency: Currency;
  adults: number;
  children: number;
  days: number;
  fromCity: string;
  fromCountry: string;
  travelMonth: string;
  preferences: string[];
  referenceTrip: string;
}

export interface CostBreakdown {
  flights: number;
  hotels: number;
  localTransport: number;
  food: number;
  activities: number;
  emergencyMisc: number;
  total: number;
}

export interface LocalTransportDetail {
  type: string;
  approxCost: number;
  description: string;
}

export interface TransportOption {
  type: 'flight' | 'train' | 'bus';
  name: string;
  cost: number;
  travelTime: string;
  route: string;
  bookingTip: string;
  localTransportOptions: LocalTransportDetail[];
}

export interface HotelOption {
  id: string;
  name: string;
  category: 'budget' | 'comfortable' | 'premium';
  pricePerNight: number;
  rating: number;
  reviewCount: number;
  location: string;
  distanceFromAttractions: string;
  facilities: string[];
  image: string;
  description: string;
}

export interface Attraction {
  id: string;
  name: string;
  category: string;
  description: string;
  entryFee: number;
  recommendedTime: string;
  approxTravelCost: number;
  distanceFromHotel: string;
  matchReason: string;
  image: string;
  included: boolean;
}

export interface ItineraryActivity {
  time: string;
  title: string;
  icon: string;
  description: string;
  estimatedCost: number;
  location: string;
}

export interface DayItinerary {
  day: number;
  title: string;
  theme: string;
  activities: ItineraryActivity[];
  travelTip: string;
}

export interface CheaperSuggestion {
  id: string;
  category: 'hotel' | 'transport' | 'activity' | 'flight' | 'dining';
  title: string;
  description: string;
  potentialSavings: number;
  applied: boolean;
  actionType: 'switch_hotel' | 'switch_transit' | 'free_activity' | 'off_peak' | 'custom';
}

export interface DestinationPlan {
  id: string;
  country: string;
  primaryCity: string;
  flagEmoji: string;
  tagline: string;
  heroImage: string;
  estimatedTotal: number;
  budgetFit: 'within' | 'exact' | 'exceeds';
  recommendedDuration: number;
  travelStyles: string[];
  whyThisFits: string;
  breakdown: CostBreakdown;
  transport: TransportOption;
  hotels: HotelOption[];
  selectedHotelId: string;
  attractions: Attraction[];
  itinerary: DayItinerary[];
  cheaperSuggestions: CheaperSuggestion[];
  visaInfo: string;
  bestTimeToVisit: string;
  dailyAverageSpend: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  actionTriggered?: {
    type: 'APPLY_DISCOUNT' | 'CHANGE_HOTEL' | 'REPLACE_DAY' | 'ALERT';
    payload?: any;
    label: string;
  };
}

export interface SavedTrip {
  id: string;
  destination: DestinationPlan;
  userInput: UserInput;
  savedAt: string;
  notes?: string;
}
