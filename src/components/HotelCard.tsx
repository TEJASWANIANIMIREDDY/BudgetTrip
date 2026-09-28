import React from 'react';
import { Star, MapPin, Check, Wifi, Sparkles, CheckCircle2, BedDouble } from 'lucide-react';
import { HotelOption, Currency } from '../types/travel';
import { formatCurrency } from '../utils/formatters';

interface HotelSectionProps {
  hotels: HotelOption[];
  selectedHotelId: string;
  totalNights: number;
  currency: Currency;
  onSelectHotel: (hotelId: string) => void;
}

export const HotelCard: React.FC<HotelSectionProps> = ({
  hotels,
  selectedHotelId,
  totalNights,
  currency,
  onSelectHotel
}) => {
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'budget':
        return {
          label: 'Budget Stay (₹1,000–₹1,500/night)',
          color: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
        };
      case 'comfortable':
        return {
          label: 'Comfortable Stay (₹1,500–₹3,000/night)',
          color: 'bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800'
        };
      case 'premium':
        return {
          label: 'Premium Stay (₹3,000+/night)',
          color: 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
        };
      default:
        return {
          label: 'Standard',
          color: 'bg-slate-100 text-slate-700 border-slate-200'
        };
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-md p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-2">
            <BedDouble className="w-3.5 h-3.5" />
            Accommodation Tiers
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Hotel Recommendations
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Choose your preferred stay tier. The AI recalculates the complete trip budget dynamically.
          </p>
        </div>

        <div className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
          Duration: <span className="text-slate-900 dark:text-white font-extrabold">{totalNights} Nights</span>
        </div>
      </div>

      {/* Hotel Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {hotels.map((hotel) => {
          const isSelected = hotel.id === selectedHotelId;
          const badge = getCategoryBadge(hotel.category);
          const totalStayCost = hotel.pricePerNight * totalNights;

          return (
            <div
              key={hotel.id}
              className={`rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/10 shadow-lg ring-2 ring-emerald-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
              }`}
            >
              <div>
                {/* Photo & Category Badge */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                  
                  {/* Category Pill */}
                  <div className="absolute top-3 left-3">
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border backdrop-blur-md shadow-sm ${badge.color}`}>
                      {hotel.category} Stay
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full flex items-center gap-1 text-white text-xs font-bold">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{hotel.rating}</span>
                    <span className="text-[10px] opacity-75">({hotel.reviewCount})</span>
                  </div>

                  {/* Price overlay on image */}
                  <div className="absolute bottom-3 left-3 right-3 text-white flex items-baseline justify-between">
                    <div>
                      <span className="text-xl font-black">
                        {formatCurrency(hotel.pricePerNight, currency)}
                      </span>
                      <span className="text-xs opacity-80"> / night</span>
                    </div>
                    <div className="text-right text-[11px] opacity-90 font-medium">
                      {formatCurrency(totalStayCost, currency)} total ({totalNights}n)
                    </div>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-4 sm:p-5 space-y-3">
                  <h4 className="font-extrabold text-base text-slate-900 dark:text-white leading-tight">
                    {hotel.name}
                  </h4>

                  <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{hotel.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                      <span>🎯</span>
                      <span>{hotel.distanceFromAttractions}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                    {hotel.description}
                  </p>

                  {/* Facilities */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {hotel.facilities.map((fac, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md"
                      >
                        ✓ {fac}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-4 sm:p-5 pt-0">
                <button
                  type="button"
                  onClick={() => onSelectHotel(hotel.id)}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 ring-2 ring-emerald-500/20'
                      : 'border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Selected Hotel
                    </>
                  ) : (
                    'Choose This Hotel'
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
