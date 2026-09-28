import { DestinationPlan, UserInput } from '../types/travel';

export const POPULAR_ORIGIN_CITIES = [
  { city: 'Mumbai', country: 'India' },
  { city: 'New Delhi', country: 'India' },
  { city: 'Bengaluru', country: 'India' },
  { city: 'Chennai', country: 'India' },
  { city: 'Kolkata', country: 'India' },
  { city: 'Hyderabad', country: 'India' },
  { city: 'Dubai', country: 'UAE' },
  { city: 'Singapore', country: 'Singapore' },
  { city: 'London', country: 'United Kingdom' },
  { city: 'New York', country: 'United States' }
];

export const TRAVEL_PREFERENCES_LIST = [
  { id: 'Beaches', label: 'Beaches', icon: '🏖️' },
  { id: 'Mountains', label: 'Mountains', icon: '⛰️' },
  { id: 'Adventure', label: 'Adventure', icon: '🧗' },
  { id: 'Nature', label: 'Nature', icon: '🌿' },
  { id: 'Culture', label: 'Culture', icon: '🏛️' },
  { id: 'Shopping', label: 'Shopping', icon: '🛍️' },
  { id: 'Food', label: 'Food', icon: '🍜' },
  { id: 'Nightlife', label: 'Nightlife', icon: '🍸' },
  { id: 'Historical places', label: 'Historical places', icon: '🏯' },
  { id: 'Relaxation', label: 'Relaxation', icon: '🧘' },
  { id: 'Photography', label: 'Photography', icon: '📸' }
];

export const REFERENCE_PRESETS = [
  'I want something similar to Thailand but cheaper',
  'I like Bali but my budget is only ₹40,000',
  'Peaceful mountain retreat like Himachal/Switzerland on budget',
  'Rich cultural heritage, ancient temples and street food',
  'Relaxed beach vacation with island hopping and scuba',
  'European aesthetic & cafe culture on an Asian budget'
];

export const CURATED_DESTINATION_TEMPLATES: DestinationPlan[] = [
  {
    id: 'vietnam',
    country: 'Vietnam',
    primaryCity: 'Hanoi & Da Nang',
    flagEmoji: '🇻🇳',
    tagline: 'Timeless charm, legendary street eats, and jaw-dropping limestone karsts',
    heroImage: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
    estimatedTotal: 38500,
    budgetFit: 'within',
    recommendedDuration: 5,
    travelStyles: ['Food', 'Culture', 'Nature', 'Adventure'],
    whyThisFits: 'Vietnam offers exceptional purchasing power. High-tier street food costs under ₹200/meal, and comfortable boutique stays are under ₹1,800/night.',
    breakdown: {
      flights: 15000,
      hotels: 8000,
      localTransport: 3500,
      food: 5000,
      activities: 4000,
      emergencyMisc: 3000,
      total: 38500
    },
    transport: {
      type: 'flight',
      name: 'Round-trip Budget Airline (e.g. VietJet / AirAsia)',
      cost: 15000,
      travelTime: 'Approx. 4h 30m direct',
      route: 'Starting Location → Hanoi (HAN) / Da Nang (DAD)',
      bookingTip: 'Book 4-6 weeks early for mid-week departures to save up to 25% on airfare.',
      localTransportOptions: [
        { type: 'Grab Car / Bike', approxCost: 1800, description: 'Super affordable app-based rides in cities' },
        { type: 'Overnight Sleeper Bus', approxCost: 1200, description: 'Scenic and eliminates one night hotel cost' },
        { type: 'City Metro & Walking', approxCost: 500, description: 'Hanoi metro and walking in Old Quarter' }
      ]
    },
    hotels: [
      {
        id: 'vn-h1',
        name: 'Hanoi Eco Boutique Hostel & Private Rooms',
        category: 'budget',
        pricePerNight: 1200,
        rating: 4.8,
        reviewCount: 420,
        location: 'Old Quarter, Hanoi',
        distanceFromAttractions: '400m to Hoan Kiem Lake',
        facilities: ['Free Breakfast', 'High-speed WiFi', 'Air Conditioning', 'Tour Desk'],
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
        description: 'Charming heritage building right in the heart of street food alleyways.'
      },
      {
        id: 'vn-h2',
        name: 'Silk Path Luxury French Quarter Hotel',
        category: 'comfortable',
        pricePerNight: 2400,
        rating: 4.9,
        reviewCount: 680,
        location: 'French Quarter, Hanoi',
        distanceFromAttractions: '800m to Opera House',
        facilities: ['Rooftop Bar', 'Complimentary Buffet Breakfast', 'Rain Shower', 'City View Balcony'],
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
        description: 'Refined colonial aesthetic with modern amenities and peaceful soundproof rooms.'
      },
      {
        id: 'vn-h3',
        name: 'InterContinental Westlake Lakeside Pavilion',
        category: 'premium',
        pricePerNight: 4800,
        rating: 4.9,
        reviewCount: 950,
        location: 'Tay Ho (West Lake), Hanoi',
        distanceFromAttractions: '10 min taxi to Old Quarter',
        facilities: ['Infinity Pool', 'Lake Pavilion', 'Spa & Wellness', 'Airport Chauffeur'],
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80',
        description: 'Built over the tranquil waters of West Lake with 5-star Vietnamese hospitality.'
      }
    ],
    selectedHotelId: 'vn-h1',
    attractions: [
      {
        id: 'vn-a1',
        name: 'Halong Bay / Lan Ha Day Cruise',
        category: 'Nature',
        description: 'Sail through thousand-year-old emerald waters and limestone islets with kayaking.',
        entryFee: 1800,
        recommendedTime: '6 hours',
        approxTravelCost: 400,
        distanceFromHotel: 'Organized transfer included',
        matchReason: 'Unmatched natural beauty and bucket-list UNESCO heritage experience.',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
        included: true
      },
      {
        id: 'vn-a2',
        name: 'Temple of Literature & Imperial Academy',
        category: 'Historical places',
        description: 'Vietnam’s first national university dating back to 1070 with courtyards and turtle steles.',
        entryFee: 300,
        recommendedTime: '2 hours',
        approxTravelCost: 150,
        distanceFromHotel: '1.8 km',
        matchReason: 'Deep dive into Confucian scholarship and ancient architecture.',
        image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=600&q=80',
        included: true
      },
      {
        id: 'vn-a3',
        name: 'Hanoi Train Street & French Quarter Walk',
        category: 'Photography',
        description: 'Famous narrow tracks where trains squeeze past residential balconies and quaint cafes.',
        entryFee: 0,
        recommendedTime: '1.5 hours',
        approxTravelCost: 100,
        distanceFromHotel: '1.2 km',
        matchReason: 'One-of-a-kind urban phenomenon and vibrant photography spot.',
        image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80',
        included: true
      },
      {
        id: 'vn-a4',
        name: 'Old Quarter Midnight Street Food Crawl',
        category: 'Food',
        description: 'Taste authentic Pho Bo, Bun Cha, Banh Mi, and creamy Egg Coffee on tiny blue plastic chairs.',
        entryFee: 600,
        recommendedTime: '3 hours',
        approxTravelCost: 100,
        distanceFromHotel: '300m',
        matchReason: 'World-renowned culinary culture at minimal pocket pinch.',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
        included: true
      }
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival & Old Quarter Flavors',
        theme: 'Cultural Welcome',
        travelTip: 'Grab a local SIM card at the airport for under ₹400 and book a Grab taxi directly.',
        activities: [
          { time: '11:00 AM', title: 'Airport Arrival & Hotel Check-in', icon: '✈️', description: 'Land at Noi Bai, smooth immigration, settle into hotel.', estimatedCost: 350, location: 'Old Quarter' },
          { time: '01:30 PM', title: 'Legendary Bun Cha Lunch', icon: '🍜', description: 'Charcoal grilled pork with rice noodles and crispy spring rolls.', estimatedCost: 200, location: 'Hang Manh Street' },
          { time: '04:00 PM', title: 'Walk around Hoan Kiem Lake & Ngoc Son Temple', icon: '🚶', description: 'Cross the red scarlet bridge and soak in lakeside breezes.', estimatedCost: 120, location: 'Hoan Kiem' },
          { time: '07:30 PM', title: 'Egg Coffee at Cafe Giang', icon: '☕', description: 'Sip the iconic 1946 whipped egg yolk coffee in hidden alley.', estimatedCost: 150, location: 'Nguyen Huu Huan' }
        ]
      },
      {
        day: 2,
        title: 'Imperial Temples & Train Street Thrill',
        theme: 'History & Photography',
        travelTip: 'Visit Temple of Literature early morning around 8:30 AM before tour buses arrive.',
        activities: [
          { time: '09:00 AM', title: 'Temple of Literature Exploration', icon: '🏯', description: 'Explore ancient courtyards, stone steles, and lotus ponds.', estimatedCost: 300, location: 'Dong Da District' },
          { time: '12:30 PM', title: 'Banh Mi 25 Gourmet Lunch', icon: '🥖', description: 'Warm crispy baguettes loaded with pate, barbecue pork, and herbs.', estimatedCost: 180, location: 'Hang Ca Street' },
          { time: '03:30 PM', title: 'Train Street Balcony View', icon: '🚂', description: 'Sip iced tea while the train rushes through the narrow alley.', estimatedCost: 150, location: 'Tran Phu Track' },
          { time: '07:00 PM', title: 'Ta Hien Beer Street Nightlife', icon: '🍻', description: 'Vibrant outdoor atmosphere, fresh Bia Hoi draft beer at ₹30/glass.', estimatedCost: 400, location: 'Ta Hien' }
        ]
      },
      {
        day: 3,
        title: 'Day Cruise to Halong & Lan Ha Bay',
        theme: 'Spectacular Nature',
        travelTip: 'Pack sunscreen, swim clothes, and a waterproof bag for kayaking.',
        activities: [
          { time: '07:30 AM', title: 'Scenic Express Shuttle to Marina', icon: '🚐', description: 'Comfortable highway transfer via Red River delta.', estimatedCost: 0, location: 'Tuan Chau' },
          { time: '11:00 AM', title: 'Board Cruise & Welcome Seafood Lunch', icon: '🚢', description: 'Buffet lunch amidst towering limestone pillars.', estimatedCost: 1500, location: 'Halong Bay' },
          { time: '02:00 PM', title: 'Kayaking in Dark & Bright Cave', icon: '🛶', description: 'Paddle through hidden tidal grottos and emerald lagoons.', estimatedCost: 300, location: 'Lan Ha' },
          { time: '07:30 PM', title: 'Return to Hanoi & Hot Pho Dinner', icon: '🍜', description: 'Steaming bowl of Pho Thin with tender stir-fried beef.', estimatedCost: 220, location: 'Lo Duc' }
        ]
      },
      {
        day: 4,
        title: 'Artisan Markets & French Architecture',
        theme: 'Shopping & Architecture',
        travelTip: 'Bargain politely at Dong Xuan market; starting at 60% of quoted price is customary.',
        activities: [
          { time: '09:30 AM', title: 'Dong Xuan Traditional Market', icon: '🛍️', description: 'Browse Vietnamese silks, woven bamboo crafts, and coffee beans.', estimatedCost: 500, location: 'Dong Xuan' },
          { time: '01:00 PM', title: 'St. Joseph’s Cathedral & French Cafes', icon: '🏛️', description: 'Neo-Gothic 1886 cathedral and Paris-style shaded boulevards.', estimatedCost: 200, location: 'Nha Chung' },
          { time: '04:30 PM', title: 'Traditional Water Puppet Theater', icon: '🎭', description: 'Ancient folklore performed over waist-deep water pools.', estimatedCost: 400, location: 'Dinh Tien Hoang' },
          { time: '08:00 PM', title: 'Sunset Cocktail Over West Lake', icon: '🌅', description: 'Panoramic evening vista of Hanoi skyline.', estimatedCost: 450, location: 'Tay Ho' }
        ]
      },
      {
        day: 5,
        title: 'Last Souvenir Hunt & Departure',
        theme: 'Farewell Vietnam',
        travelTip: 'Buy vacuum-sealed Vietnamese Arabica and Robusta beans as gifts.',
        activities: [
          { time: '09:00 AM', title: 'Morning Walk along Truc Bach Lake', icon: '🌿', description: 'Peaceful morning with locals practicing Tai Chi.', estimatedCost: 0, location: 'Truc Bach' },
          { time: '11:30 AM', title: 'Check-out & Final Street Meal', icon: '🍲', description: 'Crispy Banh Xeo pancakes filled with shrimp and bean sprouts.', estimatedCost: 250, location: 'Hang Bo' },
          { time: '02:00 PM', title: 'Airport Express Transfer', icon: '🚕', description: 'Smooth 35-minute drive to Noi Bai International Airport.', estimatedCost: 450, location: 'Noi Bai' }
        ]
      }
    ],
    cheaperSuggestions: [
      {
        id: 'cs-vn-1',
        category: 'hotel',
        title: 'Switch to Eco Dorm or Budget Guesthouse',
        description: 'Choosing a highly-rated Old Quarter guesthouse saves ₹2,800 over 5 nights.',
        potentialSavings: 2800,
        applied: false,
        actionType: 'switch_hotel'
      },
      {
        id: 'cs-vn-2',
        category: 'transport',
        title: 'Use 86 Airport Express Bus instead of Private Taxi',
        description: 'The clean AC Airport Express bus stops right in Old Quarter for only ₹150 vs ₹900 cab.',
        potentialSavings: 1500,
        applied: false,
        actionType: 'switch_transit'
      },
      {
        id: 'cs-vn-3',
        category: 'activity',
        title: 'Self-guided Old Quarter Architecture walk',
        description: 'Swap paid guided tour with verified self-guided audio map.',
        potentialSavings: 900,
        applied: false,
        actionType: 'free_activity'
      }
    ],
    visaInfo: 'Easy E-Visa online for 30–90 days (approx. $25 / ₹2,100). Smooth approval in 3 working days.',
    bestTimeToVisit: 'October to April (cool, dry, and pleasant)',
    dailyAverageSpend: 2200
  },
  {
    id: 'sri-lanka',
    country: 'Sri Lanka',
    primaryCity: 'Colombo, Kandy & Mirissa',
    flagEmoji: '🇱🇰',
    tagline: 'Lush tea plantations, the world’s most scenic blue train, and golden beaches',
    heroImage: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1200&q=80',
    estimatedTotal: 34500,
    budgetFit: 'within',
    recommendedDuration: 5,
    travelStyles: ['Nature', 'Beaches', 'Culture', 'Mountains'],
    whyThisFits: 'Close proximity means short flights, free or cheap entry to beaches, and affordable state railway journeys through mist-covered hills.',
    breakdown: {
      flights: 13500,
      hotels: 7500,
      localTransport: 3200,
      food: 4500,
      activities: 3300,
      emergencyMisc: 2500,
      total: 34500
    },
    transport: {
      type: 'flight',
      name: 'Direct flight (SriLankan Airlines / IndiGo / AirAsia)',
      cost: 13500,
      travelTime: 'Approx. 2h 30m direct',
      route: 'Starting Location → Colombo Bandaranaike (CMB)',
      bookingTip: 'Southern coastal express trains cost only ₹120 and run along the ocean rim.',
      localTransportOptions: [
        { type: 'Scenic Blue Hill Train', approxCost: 400, description: 'Iconic journey from Kandy to Ella through tea gardens' },
        { type: 'PickMe / TukTuk App', approxCost: 1500, description: 'Metred three-wheelers with transparent pricing' },
        { type: 'Intercity AC Express Buses', approxCost: 1300, description: 'Fast highways connecting Colombo to South Coast' }
      ]
    },
    hotels: [
      {
        id: 'sl-h1',
        name: 'Galle Face Green Coastline Stay',
        category: 'budget',
        pricePerNight: 1300,
        rating: 4.7,
        reviewCount: 310,
        location: 'Colombo 03 / Kollupitiya',
        distanceFromAttractions: 'Walking distance to ocean promenade',
        facilities: ['Free High-Speed WiFi', 'Hot Showers', 'Rooftop Cafe', 'Locker storage'],
        image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=600&q=80',
        description: 'Clean, airy beachfront vibe with friendly local hosts and Ceylon tea station.'
      },
      {
        id: 'sl-h2',
        name: 'Kandy Hillcrest Colonial Villa',
        category: 'comfortable',
        pricePerNight: 2200,
        rating: 4.8,
        reviewCount: 490,
        location: 'Kandy Lake View',
        distanceFromAttractions: '1 km from Temple of the Tooth',
        facilities: ['Mountain Valley View', 'Breakfast Included', 'Tea Plantation Garden', 'Air Conditioning'],
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80',
        description: 'Surrounded by tropical spice flora with cool hill station breezes.'
      },
      {
        id: 'sl-h3',
        name: 'Mirissa Palm Paradise Beachfront Villa',
        category: 'premium',
        pricePerNight: 4200,
        rating: 4.9,
        reviewCount: 520,
        location: 'Mirissa Beach',
        distanceFromAttractions: 'Steps away from Coconut Tree Hill',
        facilities: ['Private Beach Access', 'Infinity Pool', 'Ayurvedic Spa', 'Seafood Grill'],
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
        description: 'Wake up to turquoise Indian Ocean waves crashing against soft golden sands.'
      }
    ],
    selectedHotelId: 'sl-h1',
    attractions: [
      {
        id: 'sl-a1',
        name: 'Sigiriya Rock Fortress or Pidurangala Rock',
        category: 'Historical places',
        description: 'Climb Pidurangala for sunrise with unobstructed views of the ancient Lion Fortress.',
        entryFee: 800,
        recommendedTime: '3.5 hours',
        approxTravelCost: 400,
        distanceFromHotel: 'Day excursion',
        matchReason: 'One of Asia’s most iconic geological and archaeological spectacles.',
        image: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=600&q=80',
        included: true
      },
      {
        id: 'sl-a2',
        name: 'Nine Arch Bridge & Ella Peak Walk',
        category: 'Photography',
        description: 'Colonial viaduct surrounded by emerald forests where trains glide past.',
        entryFee: 0,
        recommendedTime: '2 hours',
        approxTravelCost: 150,
        distanceFromHotel: '1.5 km',
        matchReason: 'Free entry, iconic photos, and easy nature walking trails.',
        image: 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=600&q=80',
        included: true
      },
      {
        id: 'sl-a3',
        name: 'Galle Fort Heritage Ramparts',
        category: 'Culture',
        description: '16th century Portuguese and Dutch fortress lined with boutique cafes, lighthouse, and ocean walls.',
        entryFee: 0,
        recommendedTime: '3 hours',
        approxTravelCost: 200,
        distanceFromHotel: '2.5 km',
        matchReason: 'Stunning sunset walk with zero ticket charges.',
        image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=600&q=80',
        included: true
      }
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Colombo & Galle Face Sunset',
        theme: 'Coastal City',
        travelTip: 'Try the Isso Wade (crispy prawn fritters) at Galle Face Green for ₹60.',
        activities: [
          { time: '10:00 AM', title: 'Touchdown in Colombo & Coastal Express', icon: '✈️', description: 'Arrive at Bandaranaike airport, scenic coastal transfer.', estimatedCost: 350, location: 'Colombo' },
          { time: '01:00 PM', title: 'Authentic Rice & Curry Lunch', icon: '🍛', description: '7-curry banana leaf meal with fresh coconut sambal.', estimatedCost: 200, location: 'Pettah' },
          { time: '04:30 PM', title: 'Galle Face Green Kite Flying & Breeze', icon: '🪁', description: 'Lively beachfront gathering with street food stalls.', estimatedCost: 100, location: 'Galle Face' }
        ]
      },
      {
        day: 2,
        title: 'Scenic Blue Train to Kandy & Sacred Relic',
        theme: 'Highland Serenity',
        travelTip: 'Sit on the right side of the train for the most dramatic cliffside vistas.',
        activities: [
          { time: '08:00 AM', title: 'Blue Express Train to Kandy', icon: '🚆', description: 'Ascend through cloud forests and cascading waterfalls.', estimatedCost: 200, location: 'Kandy Railway' },
          { time: '01:30 PM', title: 'Temple of the Tooth Relic', icon: '🛕', description: 'Revered Buddhist shrine beside peaceful lake.', estimatedCost: 650, location: 'Kandy Lake' },
          { time: '05:30 PM', title: 'Kandy Royal Botanical Gardens', icon: '🌺', description: 'Vast avenues of royal palms and fragrant orchid houses.', estimatedCost: 350, location: 'Peradeniya' }
        ]
      },
      {
        day: 3,
        title: 'Tea Estate Trail & Nine Arch Wonder',
        theme: 'Nature & Misty Hills',
        travelTip: 'Taste freshly picked Orange Pekoe tea at a highland factory.',
        activities: [
          { time: '09:00 AM', title: 'Ceylon Tea Factory Experience', icon: '🍃', description: 'Learn artisan rolling and drying with tasting flight.', estimatedCost: 300, location: 'Nuwara Eliya' },
          { time: '02:30 PM', title: 'Nine Arch Bridge Crossing', icon: '🌉', description: 'Catch the afternoon passenger train emerging from tunnel.', estimatedCost: 0, location: 'Demodara' },
          { time: '06:00 PM', title: 'Ella Cafe Chillout & Kottu Roti', icon: '🍲', description: 'Watch the rhythmic blade clatter of minced roti cooking.', estimatedCost: 250, location: 'Ella Main St' }
        ]
      },
      {
        day: 4,
        title: 'South Coast Golden Shores & Mirissa',
        theme: 'Tropical Paradise',
        travelTip: 'Walk to Coconut Tree Hill during sunset for picture-perfect golden hour.',
        activities: [
          { time: '09:00 AM', title: 'Transfer to Southern Coast', icon: '🚐', description: 'Expressway to Mirissa beaches.', estimatedCost: 450, location: 'Mirissa' },
          { time: '01:00 PM', title: 'Fresh Catch Seafood Shack Lunch', icon: '🐟', description: 'Grilled red snapper with lime garlic butter.', estimatedCost: 500, location: 'Mirissa Bay' },
          { time: '04:30 PM', title: 'Coconut Tree Hill Sunset View', icon: '🌴', description: 'Clifftop palm grove over crashing turquoise waves.', estimatedCost: 0, location: 'Mirissa' }
        ]
      },
      {
        day: 5,
        title: 'Dutch Fort of Galle & Departure',
        theme: 'Colonial Heritage & Return',
        travelTip: 'Pick up authentic Ceylon cinnamon sticks and artisanal gems.',
        activities: [
          { time: '09:30 AM', title: 'Galle Fort Ramparts & Lighthouse', icon: '🏰', description: 'Walk cobblestone pathways and sea bastions.', estimatedCost: 0, location: 'Galle' },
          { time: '01:00 PM', title: 'Farewell Hopper Feast', icon: '🍳', description: 'Bowl-shaped crispy fermented rice pancakes with poached eggs.', estimatedCost: 200, location: 'Dutch Hospital' },
          { time: '04:00 PM', title: 'Direct Highway Drive to Airport', icon: '🚕', description: 'Comfortable transfer back to CMB for return flight.', estimatedCost: 600, location: 'Bandaranaike' }
        ]
      }
    ],
    cheaperSuggestions: [
      {
        id: 'cs-sl-1',
        category: 'activity',
        title: 'Climb Pidurangala instead of Sigiriya Main Rock',
        description: 'Climbing Pidurangala costs ₹800 vs ₹3,200 for Sigiriya, and gives the best postcard view of Sigiriya itself!',
        potentialSavings: 2400,
        applied: false,
        actionType: 'free_activity'
      },
      {
        id: 'cs-sl-2',
        category: 'transport',
        title: 'Take government scenic train instead of private cab',
        description: 'The Kandy train is under ₹200 vs ₹3,500 private taxi transfer.',
        potentialSavings: 3300,
        applied: false,
        actionType: 'switch_transit'
      }
    ],
    visaInfo: 'Online ETA facility available (often free or low fee for several nationalities). 30 days validity.',
    bestTimeToVisit: 'November to April for South/West coast; May to September for East',
    dailyAverageSpend: 1900
  },
  {
    id: 'nepal',
    country: 'Nepal',
    primaryCity: 'Kathmandu & Pokhara',
    flagEmoji: '🇳🇵',
    tagline: 'Himalayan peaks, serene lakes, ancient stupas, and legendary mountain hospitality',
    heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    estimatedTotal: 27500,
    budgetFit: 'within',
    recommendedDuration: 5,
    travelStyles: ['Mountains', 'Adventure', 'Culture', 'Nature'],
    whyThisFits: 'Extremely budget-friendly. Direct overland or short flight links, zero visa fee for Indian citizens, and hearty Himalayan meals starting at ₹120.',
    breakdown: {
      flights: 11000,
      hotels: 5500,
      localTransport: 2500,
      food: 3800,
      activities: 2700,
      emergencyMisc: 2000,
      total: 27500
    },
    transport: {
      type: 'flight',
      name: 'Budget Non-Stop Flight or Overland Sleeper',
      cost: 11000,
      travelTime: 'Approx. 1h 45m from Delhi/Kolkata',
      route: 'Starting Location → Kathmandu (KTM)',
      bookingTip: 'If traveling from North India, deluxe AC sleeper buses cost under ₹2,500 one-way!',
      localTransportOptions: [
        { type: 'Tourist Deluxe Bus to Pokhara', approxCost: 900, description: 'Comfortable sofa seats with mountain river views' },
        { type: 'InDrive / Local Taxi', approxCost: 1100, description: 'Local app rides across Kathmandu valley' },
        { type: 'Mountain Bicycle Rental', approxCost: 500, description: 'Lakeside cycling in Pokhara' }
      ]
    },
    hotels: [
      {
        id: 'np-h1',
        name: 'Pokhara Lakeside Eco Lodge',
        category: 'budget',
        pricePerNight: 950,
        rating: 4.8,
        reviewCount: 380,
        location: 'Lakeside, Pokhara',
        distanceFromAttractions: '200m from Phewa Lake',
        facilities: ['Mountain Rooftop Terrace', 'Hot Water 24/7', 'High-speed WiFi', 'Trek Booking'],
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
        description: 'Relaxed bohemian vibe facing the Annapurna range on clear mornings.'
      },
      {
        id: 'np-h2',
        name: 'Kathmandu Heritage Courtyard Boutique',
        category: 'comfortable',
        pricePerNight: 1900,
        rating: 4.8,
        reviewCount: 450,
        location: 'Thamel / Patan',
        distanceFromAttractions: 'Walking distance to Patan Durbar Square',
        facilities: ['Traditional Newari Woodcarving', 'Organic Breakfast', 'Courtyard Garden', 'Air Conditioning'],
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80',
        description: 'Authentic brickwork, carved wooden windows, and tranquil heritage courtyard.'
      },
      {
        id: 'np-h3',
        name: 'Fishtail Mountain Resort & Spa',
        category: 'premium',
        pricePerNight: 3900,
        rating: 4.9,
        reviewCount: 610,
        location: 'Phewa Peninsula, Pokhara',
        distanceFromAttractions: 'Reached via private raft ferry',
        facilities: ['Lake & Mountain Panoramic View', 'Heated Pool', 'Himalayan Spa', 'Fine Dining'],
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
        description: 'Legendary historical resort where royals and trekkers have rested for decades.'
      }
    ],
    selectedHotelId: 'np-h1',
    attractions: [
      {
        id: 'np-a1',
        name: 'Phewa Lake Boating & Tal Barahi Island',
        category: 'Nature',
        description: 'Rent a colorful wooden Doonga boat on the mirror-like lake reflecting Machapuchare peak.',
        entryFee: 400,
        recommendedTime: '2 hours',
        approxTravelCost: 50,
        distanceFromHotel: '300m',
        matchReason: 'Peaceful, inexpensive, and breathtaking natural backdrop.',
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
        included: true
      },
      {
        id: 'np-a2',
        name: 'Swayambhunath Monkey Temple',
        category: 'Culture',
        description: 'Ancient hilltop Buddhist stupa offering 360-degree views of the Kathmandu valley basin.',
        entryFee: 150,
        recommendedTime: '2.5 hours',
        approxTravelCost: 150,
        distanceFromHotel: '3 km',
        matchReason: 'Mesmerizing chanting, fluttering prayer flags, and historic monuments.',
        image: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=600&q=80',
        included: true
      },
      {
        id: 'np-a3',
        name: 'Sarangkot Sunrise Himalayan Viewpoint',
        category: 'Mountains',
        description: 'Watch the first golden rays illuminate the snow-capped summits of Annapurna and Dhaulagiri.',
        entryFee: 50,
        recommendedTime: '2 hours',
        approxTravelCost: 400,
        distanceFromHotel: '8 km',
        matchReason: 'One of Earth’s grandest sunrise vistas at virtually zero ticket fee.',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
        included: true
      }
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Kathmandu & Thamel Stroll',
        theme: 'Spiritual City',
        travelTip: 'Try steamed buff or veg Momos with spicy sesame chutney in Thamel.',
        activities: [
          { time: '11:00 AM', title: 'Tribhuvan Airport Arrival', icon: '✈️', description: 'Scenic landing amidst mountain ridges, quick taxi to Thamel.', estimatedCost: 300, location: 'Tribhuvan' },
          { time: '01:30 PM', title: 'Authentic Thakali Thali Lunch', icon: '🍛', description: 'Buckwheat dhedo, organic lentil soup, gundruk, and ghee.', estimatedCost: 220, location: 'Thamel' },
          { time: '04:30 PM', title: 'Kathmandu Durbar Square & Kumari House', icon: '🏯', description: 'Centuries-old pagodas and intricate woodwork.', estimatedCost: 350, location: 'Durbar Square' }
        ]
      },
      {
        day: 2,
        title: 'Scenic Drive / Flight to Pokhara & Lake Walk',
        theme: 'Lakeside Serenity',
        travelTip: 'Take the early morning tourist bus to avoid highway truck traffic.',
        activities: [
          { time: '07:30 AM', title: 'Deluxe AC Bus along Trishuli River', icon: '🚌', description: 'Picturesque river gorge highway with white-water views.', estimatedCost: 800, location: 'Highway' },
          { time: '02:00 PM', title: 'Check in at Lakeside & Phewa Boat Ride', icon: '🛶', description: 'Rowing to the island temple of Tal Barahi.', estimatedCost: 300, location: 'Phewa Lake' },
          { time: '06:00 PM', title: 'Lakeside Sunset & Acoustic Music Cafe', icon: '☕', description: 'Relaxed evening breeze with fresh bakery treats.', estimatedCost: 200, location: 'Lakeside' }
        ]
      },
      {
        day: 3,
        title: 'Sarangkot Sunrise & Peace Pagoda',
        theme: 'High Peaks & Zen',
        travelTip: 'Wear a light jacket; early morning at Sarangkot can be chilly.',
        activities: [
          { time: '05:00 AM', title: 'Sarangkot Sunrise Over Annapurna', icon: '🌄', description: 'Witness pink alpine glow on Fishtail mountain.', estimatedCost: 400, location: 'Sarangkot' },
          { time: '10:00 AM', title: 'World Peace Pagoda (Shanti Stupa)', icon: '🕊️', description: 'White dome stupa perched atop Anadu hill.', estimatedCost: 150, location: 'Anadu' },
          { time: '03:00 PM', title: 'Devi’s Fall & Gupteshwor Mahadev Cave', icon: '🌊', description: 'Roaring underground waterfall disappearing into cavern.', estimatedCost: 180, location: 'Chhori' }
        ]
      },
      {
        day: 4,
        title: 'Old Pokhara Bazaar & Mountain Museum',
        theme: 'Culture & Mountaineering',
        travelTip: 'The International Mountain Museum has gear from legendary Everest climbers.',
        activities: [
          { time: '09:30 AM', title: 'International Mountain Museum', icon: '🧗', description: 'Fascinating exhibits on Sherpa culture and 8,000m summits.', estimatedCost: 300, location: 'Rato Pahir' },
          { time: '01:00 PM', title: 'Tibetan Camp & Handwoven Carpets', icon: '🧶', description: 'Visit Tashiling settlement and taste butter tea.', estimatedCost: 100, location: 'Tashiling' },
          { time: '05:00 PM', title: 'Rent Lakeside Bicycle for Sunset', icon: '🚲', description: 'Pedal along the peaceful northern strip of Phewa Lake.', estimatedCost: 150, location: 'North Lakeside' }
        ]
      },
      {
        day: 5,
        title: 'Return to Kathmandu & Departure',
        theme: 'Homeward Journey',
        travelTip: 'Pick up organic Himalayan honey and Singing Bowls.',
        activities: [
          { time: '08:00 AM', title: 'Scenic Return Transfer / Flight', icon: '🚐', description: 'Back to Kathmandu valley with memories of the giants.', estimatedCost: 850, location: 'Valley' },
          { time: '01:00 PM', title: 'Boudhanath Stupa Circumambulation', icon: '☸️', description: 'Join chanting monks circling the colossal mandala stupa.', estimatedCost: 200, location: 'Boudha' },
          { time: '04:00 PM', title: 'Transfer to International Airport', icon: '🚕', description: 'Easy ride for onward travel.', estimatedCost: 350, location: 'Tribhuvan' }
        ]
      }
    ],
    cheaperSuggestions: [
      {
        id: 'cs-np-1',
        category: 'transport',
        title: 'Take Deluxe Highway Bus instead of Domestic Flight',
        description: 'Taking the scenic tourist bus between Kathmandu and Pokhara costs ₹900 vs ₹4,500 domestic airfare.',
        potentialSavings: 3600,
        applied: false,
        actionType: 'switch_transit'
      },
      {
        id: 'cs-np-2',
        category: 'hotel',
        title: 'Choose Lakeside Family Homestay',
        description: 'Warm local hospitality with homemade organic meals saves ₹1,500.',
        potentialSavings: 1500,
        applied: false,
        actionType: 'switch_hotel'
      }
    ],
    visaInfo: 'Visa-free for Indian nationals (voter ID or passport). Visa on arrival for most other nationalities ($30).',
    bestTimeToVisit: 'September to November (crystal clear mountain views) and March to May',
    dailyAverageSpend: 1500
  },
  {
    id: 'thailand',
    country: 'Thailand',
    primaryCity: 'Bangkok & Krabi',
    flagEmoji: '🇹🇭',
    tagline: 'Ornate temples, limestone islands, buzzing night markets, and world-class street food',
    heroImage: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1200&q=80',
    estimatedTotal: 46000,
    budgetFit: 'within',
    recommendedDuration: 5,
    travelStyles: ['Beaches', 'Food', 'Culture', 'Nightlife'],
    whyThisFits: 'The golden benchmark of backpacking and budget holidaying. Incredible hostel and 3-star hotel infrastructure, cheap internal flights, and 7-Eleven convenience.',
    breakdown: {
      flights: 17500,
      hotels: 10000,
      localTransport: 4500,
      food: 6000,
      activities: 5000,
      emergencyMisc: 3000,
      total: 46000
    },
    transport: {
      type: 'flight',
      name: 'Direct flight (AirAsia / Nok Air / IndiGo)',
      cost: 17500,
      travelTime: 'Approx. 3h 45m direct',
      route: 'Starting Location → Bangkok (DMK/BKK) / Krabi (KBV)',
      bookingTip: 'Fly into DMK for low-cost carriers; BTS Skytrain avoids legendary Bangkok traffic.',
      localTransportOptions: [
        { type: 'BTS Skytrain & MRT Day Pass', approxCost: 1200, description: 'Air-conditioned rapid transit skipping all traffic jams' },
        { type: 'Chao Phraya River Express Boat', approxCost: 400, description: 'Scenic river travel for just ₹40/trip' },
        { type: 'Longtail Boat Island Hopping', approxCost: 1800, description: 'Classic wooden longtail shared boats' }
      ]
    },
    hotels: [
      {
        id: 'th-h1',
        name: 'Lub d Bangkok Siam / Sukhumvit Hostel & Pods',
        category: 'budget',
        pricePerNight: 1400,
        rating: 4.8,
        reviewCount: 920,
        location: 'Siam Square / Sukhumvit',
        distanceFromAttractions: '2 min walk to BTS Station',
        facilities: ['Modern Pod Beds', 'Co-working Lounge', 'Free Fast WiFi', 'Social Bar'],
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
        description: 'Award-winning design hostel with private en-suite rooms and lively common zones.'
      },
      {
        id: 'th-h2',
        name: 'Chao Phraya Riverside Boutique Hotel',
        category: 'comfortable',
        pricePerNight: 2800,
        rating: 4.9,
        reviewCount: 840,
        location: 'Riverside / Old City',
        distanceFromAttractions: 'Opposite Wat Arun',
        facilities: ['River View Terrace', 'Rooftop Bar', 'Pool', 'Breakfast Included'],
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
        description: 'Watch illuminated temple spires glowing over the river at night.'
      },
      {
        id: 'th-h3',
        name: 'Krabi Cliffside Pool Villa Resort',
        category: 'premium',
        pricePerNight: 5500,
        rating: 4.9,
        reviewCount: 780,
        location: 'Ao Nang / Railay',
        distanceFromAttractions: 'Beachfront access',
        facilities: ['Private Plunge Pool', 'Full Spa', 'Speedboat Excursions', 'Butler Service'],
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80',
        description: 'Tucked into dramatic limestone cliffs overlooking Andaman Sea.'
      }
    ],
    selectedHotelId: 'th-h1',
    attractions: [
      {
        id: 'th-a1',
        name: 'Grand Palace & Wat Pho Reclining Buddha',
        category: 'Historical places',
        description: 'Glorious golden chedis and the 46m-long gold leaf reclining Buddha.',
        entryFee: 1200,
        recommendedTime: '3 hours',
        approxTravelCost: 150,
        distanceFromHotel: '3 km',
        matchReason: 'Masterpiece of Thai royal art and Buddhist heritage.',
        image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=600&q=80',
        included: true
      },
      {
        id: 'th-a2',
        name: 'Four Islands Sunset Tour in Krabi',
        category: 'Beaches',
        description: 'Snorkel at Chicken Island, walk the sandbar at Tup Island, and see Phra Nang Cave.',
        entryFee: 2000,
        recommendedTime: '5 hours',
        approxTravelCost: 200,
        distanceFromHotel: 'Excursion pickup',
        matchReason: 'Crystal turquoise waters and iconic cliff scenery.',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
        included: true
      },
      {
        id: 'th-a3',
        name: 'Chatuchak Weekend Market or Jodd Fairs',
        category: 'Shopping',
        description: 'Over 15,000 stalls with vintage clothes, handicrafts, and spicy volcanic ribs.',
        entryFee: 0,
        recommendedTime: '3.5 hours',
        approxTravelCost: 100,
        distanceFromHotel: 'BTS direct',
        matchReason: 'Vibrant street atmosphere with unbeatable souvenir prices.',
        image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=600&q=80',
        included: true
      }
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Bangkok & Riverboat Sunset',
        theme: 'River of Kings',
        travelTip: 'Download the Grab and Bolt apps for cheap transparent rides when BTS is closed.',
        activities: [
          { time: '11:00 AM', title: 'Airport Rail Link to City', icon: '🚆', description: 'Beat the highway traffic with 30-min express train.', estimatedCost: 120, location: 'Suvarnabhumi' },
          { time: '01:30 PM', title: 'Pad Thai Thip Samai Lunch', icon: '🍜', description: 'Legendary egg-wrapped thin rice noodles with jumbo prawns.', estimatedCost: 250, location: 'Maha Chai' },
          { time: '05:00 PM', title: 'Chao Phraya Orange Flag Boat', icon: '⛴️', description: 'Glide past temples during golden sunset for ₹40.', estimatedCost: 40, location: 'Sathorn Pier' },
          { time: '08:00 PM', title: 'Jodd Fairs Night Market Crawl', icon: '🍢', description: 'Crispy pork belly, coconut smoothies, and live music.', estimatedCost: 350, location: 'Rama 9' }
        ]
      },
      {
        day: 2,
        title: 'Spiritual Wonders & Siam Shopping',
        theme: 'Heritage Meets Modernity',
        travelTip: 'Cover knees and shoulders when entering Wat Phra Kaew; dress code is strict.',
        activities: [
          { time: '08:30 AM', title: 'Wat Pho & Traditional Thai Massage', icon: '🛕', description: 'Birthplace of traditional massage and giant Buddha.', estimatedCost: 700, location: 'Phra Nakhon' },
          { time: '12:30 PM', title: 'Wat Arun Cross-River Ferry', icon: '⛵', description: 'Climb the ceramic porcelain spires of Temple of Dawn.', estimatedCost: 200, location: 'Wat Arun' },
          { time: '04:00 PM', title: 'Siam Center & MBK Tech Hunting', icon: '🛍️', description: 'Air-conditioned mall shopping and creative souvenirs.', estimatedCost: 500, location: 'Siam' }
        ]
      },
      {
        day: 3,
        title: 'Tropical Krabi / Railay Beach Escape',
        theme: 'Island Bliss',
        travelTip: 'Railay Beach is only accessible by boat; no cars or motorbikes exist there.',
        activities: [
          { time: '08:00 AM', title: 'Quick Morning Flight to Krabi', icon: '✈️', description: '1h 10m flight into southern tropical archipelago.', estimatedCost: 2200, location: 'Krabi Airport' },
          { time: '12:00 PM', title: 'Longtail Boat to Railay Beach', icon: '🚤', description: 'Dock at secluded beach encircled by sheer karst towers.', estimatedCost: 300, location: 'Ao Nang' },
          { time: '03:30 PM', title: 'Phra Nang Cave Beach Swimming', icon: '🏊', description: 'Warm emerald sea with limestone cliffs rising straight from water.', estimatedCost: 0, location: 'Railay' }
        ]
      },
      {
        day: 4,
        title: 'Four Islands Snorkel Cruise',
        theme: 'Undersea Wonders',
        travelTip: 'Bring reef-safe sunscreen and a dry bag.',
        activities: [
          { time: '09:00 AM', title: 'Board Island Cruise', icon: '⚓', description: 'Visit Tup Island sandbar walk and Chicken Island.', estimatedCost: 1500, location: 'Andaman Sea' },
          { time: '01:00 PM', title: 'Beach Picnic Lunch', icon: '🍱', description: 'Fresh pineapple, Thai fried rice, and cold coconut.', estimatedCost: 0, location: 'Poda Island' },
          { time: '07:00 PM', title: 'Krabi Night Market Seafood BBQ', icon: '🦞', description: 'Charcoal tiger prawns, calamari, and mango sticky rice.', estimatedCost: 450, location: 'Krabi Town' }
        ]
      },
      {
        day: 5,
        title: 'Emerald Pool or Thai Cooking Class & Flight',
        theme: 'Sweet Memories',
        travelTip: 'Stock up on Dried Durian and Thai Milk Tea packets at 7-Eleven.',
        activities: [
          { time: '09:00 AM', title: 'Hot Springs & Emerald Lagoon Dip', icon: '♨️', description: 'Natural mineral pool nestled inside rainforest.', estimatedCost: 400, location: 'Khao Phra' },
          { time: '01:30 PM', title: 'Farewell Green Curry Lunch', icon: '🍛', description: 'Fragrant spicy coconut chicken curry.', estimatedCost: 220, location: 'Ao Nang' },
          { time: '04:30 PM', title: 'Airport Transfer for Departure', icon: '🚕', description: 'Direct ride to Krabi/Bangkok airport for return home.', estimatedCost: 500, location: 'Airport' }
        ]
      }
    ],
    cheaperSuggestions: [
      {
        id: 'cs-th-1',
        category: 'transport',
        title: 'Skip Tuk-Tuks and use BTS/MRT + Grab',
        description: 'Street tuk-tuks often charge inflated tourist fares; using BTS and river ferries saves ₹2,200.',
        potentialSavings: 2200,
        applied: false,
        actionType: 'switch_transit'
      },
      {
        id: 'cs-th-2',
        category: 'dining',
        title: 'Dine at local street stalls and food courts like Pier 21',
        description: 'Terminal 21’s Pier 21 food court offers Michelin-praised meals for under ₹90/dish.',
        potentialSavings: 1800,
        applied: false,
        actionType: 'switch_hotel'
      }
    ],
    visaInfo: 'Visa exemption or Visa-on-Arrival (often 30–60 days free for many countries, check current policy).',
    bestTimeToVisit: 'November to March (dry and sun-drenched)',
    dailyAverageSpend: 2800
  },
  {
    id: 'bali',
    country: 'Indonesia (Bali)',
    primaryCity: 'Ubud & Canggu',
    flagEmoji: '🇮🇩',
    tagline: 'Cascading rice terraces, spiritual water temples, surf breaks, and lush jungle villas',
    heroImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    estimatedTotal: 48500,
    budgetFit: 'within',
    recommendedDuration: 5,
    travelStyles: ['Nature', 'Relaxation', 'Culture', 'Photography'],
    whyThisFits: 'While international flights can be moderately higher, daily life in Bali is remarkably affordable: gorgeous homestays with pools for ₹1,600 and hearty Nasi Goreng for ₹150.',
    breakdown: {
      flights: 21000,
      hotels: 9500,
      localTransport: 4500,
      food: 5500,
      activities: 4500,
      emergencyMisc: 3500,
      total: 48500
    },
    transport: {
      type: 'flight',
      name: 'Connecting Flight via KL or Singapore (AirAsia / Batik Air)',
      cost: 21000,
      travelTime: 'Approx. 7h (with 1 short layover)',
      route: 'Starting Location → Denpasar (DPS)',
      bookingTip: 'Book flights with a quick transit in Kuala Lumpur to grab the cheapest round-trip fare.',
      localTransportOptions: [
        { type: 'Scooter / Moped Rental', approxCost: 1500, description: '₹300/day scooter gives ultimate freedom (international permit needed)' },
        { type: 'Gojek / Grab Car', approxCost: 2000, description: 'Easy rides for airport and inter-town travel' },
        { type: 'Day Driver Hire', approxCost: 1000, description: 'Shared private driver for waterfall tour' }
      ]
    },
    hotels: [
      {
        id: 'id-h1',
        name: 'Ubud Tropical Rice Paddy Homestay',
        category: 'budget',
        pricePerNight: 1400,
        rating: 4.8,
        reviewCount: 420,
        location: 'Penestanan, Ubud',
        distanceFromAttractions: '10 min walk to Campuhan Ridge',
        facilities: ['Garden Swimming Pool', 'Free Banana Pancakes Breakfast', 'Fast WiFi', 'AC'],
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80',
        description: 'Wake up to ducks waddling in the green rice paddies and warm Balinese family hospitality.'
      },
      {
        id: 'id-h2',
        name: 'Canggu Bohemian Eco Boutique Resort',
        category: 'comfortable',
        pricePerNight: 2700,
        rating: 4.9,
        reviewCount: 630,
        location: 'Batu Bolong, Canggu',
        distanceFromAttractions: '800m from Echo Beach surf spot',
        facilities: ['Lagoon Pool', 'Organic Cafe', 'Yoga Shala', 'Balcony Daybeds'],
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
        description: 'Modern bamboo and rattan architecture near the best cafes and beach clubs.'
      },
      {
        id: 'id-h3',
        name: 'Tegalalang Valley Private Infinity Villa',
        category: 'premium',
        pricePerNight: 5800,
        rating: 4.9,
        reviewCount: 510,
        location: 'Tegalalang Jungle',
        distanceFromAttractions: 'Direct view of rice terrace valley',
        facilities: ['Private Overhanging Pool', 'Floating Breakfast', 'Spa Pavilions', 'Private Butler'],
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
        description: 'Ultimate dream villa suspended above deep emerald rainforest canopies.'
      }
    ],
    selectedHotelId: 'id-h1',
    attractions: [
      {
        id: 'id-a1',
        name: 'Tegalalang Rice Terraces & Jungle Swing',
        category: 'Photography',
        description: 'UNESCO heritage subak irrigation system sculpted into lush stepped hillsides.',
        entryFee: 300,
        recommendedTime: '2.5 hours',
        approxTravelCost: 200,
        distanceFromHotel: '7 km',
        matchReason: 'Classic Bali landscape with photogenic coconut groves.',
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80',
        included: true
      },
      {
        id: 'id-a2',
        name: 'Uluwatu Sunset Temple & Kecak Fire Dance',
        category: 'Culture',
        description: 'Dramatic 70m sea cliff temple where rhythmic hypnotic fire chanting takes place at dusk.',
        entryFee: 850,
        recommendedTime: '3 hours',
        approxTravelCost: 400,
        distanceFromHotel: 'South Bali day trip',
        matchReason: 'Electrifying cultural performance against crashing Indian Ocean breakers.',
        image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=600&q=80',
        included: true
      },
      {
        id: 'id-a3',
        name: 'Tegenungan or Tibumana Waterfall',
        category: 'Nature',
        description: 'Hidden jungle waterfall with refreshing swimming lagoon and bamboo footbridges.',
        entryFee: 150,
        recommendedTime: '2 hours',
        approxTravelCost: 250,
        distanceFromHotel: '12 km',
        matchReason: 'Natural cool oasis tucked away from coastal heat.',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
        included: true
      }
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Bali & Ubud Jungle Settlement',
        theme: 'Spiritual Arrival',
        travelTip: 'Grab a local Telkomsel eSIM online before landing to avoid airport kiosks.',
        activities: [
          { time: '12:00 PM', title: 'Denpasar DPS Arrival & Ubud Transfer', icon: '✈️', description: 'Scenic drive north past stone carving villages.', estimatedCost: 900, location: 'Denpasar to Ubud' },
          { time: '03:30 PM', title: 'Check in & Traditional Warung Nasi Campur', icon: '🍛', description: 'Steamed rice with chicken satay, sambal matah, and tempeh.', estimatedCost: 160, location: 'Warung Biah Biah' },
          { time: '05:30 PM', title: 'Campuhan Ridge Sunset Walk', icon: '🚶', description: 'Paved trail between two river valleys with swaying elephant grass.', estimatedCost: 0, location: 'Campuhan' }
        ]
      },
      {
        day: 2,
        title: 'Tegalalang Terraces & Sacred Monkey Forest',
        theme: 'Nature & Ancient Shrines',
        travelTip: 'Do not make direct eye contact with monkeys or carry open plastic bags.',
        activities: [
          { time: '07:30 AM', title: 'Early Morning Tegalalang Walk', icon: '🌾', description: 'Catch the golden morning light rays through palm trees.', estimatedCost: 250, location: 'Tegalalang' },
          { time: '11:00 AM', title: 'Tirta Empul Holy Water Spring Temple', icon: '🛕', description: 'Balinese purification ritual at crystal mountain spring pools.', estimatedCost: 350, location: 'Tampaksiring' },
          { time: '03:00 PM', title: 'Ubud Sacred Monkey Forest Sanctuary', icon: '🐒', description: 'Ancient banyan trees draped in moss and playful macaque monkeys.', estimatedCost: 450, location: 'Padangtegal' }
        ]
      },
      {
        day: 3,
        title: 'Jungle Waterfalls & Coffee Plantation',
        theme: 'Tropical Adventure',
        travelTip: 'Taste local ginger tea and pure cocoa along with Luwak coffee.',
        activities: [
          { time: '09:00 AM', title: 'Tibumana Waterfall Swim', icon: '💦', description: 'Secluded curtain waterfall with calm natural plunge pool.', estimatedCost: 150, location: 'Bangli' },
          { time: '01:00 PM', title: 'Organic Farm Cafe & Herbal Tea Flight', icon: '☕', description: 'View overlooking rainforest ravine with complimentary tastings.', estimatedCost: 200, location: 'Kintamani' },
          { time: '05:30 PM', title: 'Ubud Royal Palace Cultural Dance', icon: '💃', description: 'Legong dance with gamelan orchestra.', estimatedCost: 500, location: 'Ubud Center' }
        ]
      },
      {
        day: 4,
        title: 'Canggu Surf Vibes & Uluwatu Sunset',
        theme: 'Coast & Cliffs',
        travelTip: 'Book Kecak dance tickets in advance or arrive by 4:30 PM.',
        activities: [
          { time: '09:00 AM', title: 'Transfer to Southern Coast', icon: '🛵', description: 'Ride toward the surf beaches of Canggu and Seminyak.', estimatedCost: 400, location: 'Canggu' },
          { time: '01:00 PM', title: 'Acai Smoothie Bowl & Surf Watch', icon: '🏄', description: 'Healthy tropical lunch watching world-class wave surfers.', estimatedCost: 350, location: 'Batu Bolong' },
          { time: '05:30 PM', title: 'Uluwatu Clifftop Temple & Fire Dance', icon: '🔥', description: 'Fifty men chanting "Chak" as the sun sinks into the sea.', estimatedCost: 850, location: 'Uluwatu' }
        ]
      },
      {
        day: 5,
        title: 'Souvenir Art Market & Departure',
        theme: 'Farewell Island of Gods',
        travelTip: 'Pick up handwoven rattan bags and Balinese vanilla pods.',
        activities: [
          { time: '09:30 AM', title: 'Ubud Traditional Art Market', icon: '🛍️', description: 'Handmade linen shirts, dreamcatchers, and macrame.', estimatedCost: 400, location: 'Ubud Market' },
          { time: '01:00 PM', title: 'Final Smoothie & Babi Guling Lunch', icon: '🍖', description: 'Crisp roasted suckling pig seasoned with Balinese spices.', estimatedCost: 250, location: 'Ibu Oka' },
          { time: '03:30 PM', title: 'Transfer to Ngurah Rai Airport', icon: '🚕', description: 'Comfortable ride for departure.', estimatedCost: 450, location: 'DPS Airport' }
        ]
      }
    ],
    cheaperSuggestions: [
      {
        id: 'cs-id-1',
        category: 'hotel',
        title: 'Stay in Traditional Family Compound Homestay',
        description: 'Traditional family homestays in Ubud cost around ₹1,100/night with breakfast, saving ₹3,200.',
        potentialSavings: 3200,
        applied: false,
        actionType: 'switch_hotel'
      },
      {
        id: 'cs-id-2',
        category: 'dining',
        title: 'Eat at local Warungs instead of Western Beach Clubs',
        description: 'Authentic local Warungs serve delicious fresh meals for ₹150 vs ₹1,200 at trendy beach clubs.',
        potentialSavings: 2500,
        applied: false,
        actionType: 'switch_hotel'
      }
    ],
    visaInfo: 'Visa on Arrival (VoA) for 30 days is available online or at the airport for approx. $35 / ₹2,900.',
    bestTimeToVisit: 'April to October (dry season, low humidity, perfect surf)',
    dailyAverageSpend: 2600
  },
  {
    id: 'georgia',
    country: 'Georgia (Caucasus)',
    primaryCity: 'Tbilisi & Kazbegi',
    flagEmoji: '🇬🇪',
    tagline: 'Ancient sulfur baths, dramatic Caucasus mountain peaks, warm hospitality, and 8000-year wine culture',
    heroImage: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1200&q=80',
    estimatedTotal: 58000,
    budgetFit: 'within',
    recommendedDuration: 5,
    travelStyles: ['Mountains', 'Culture', 'Historical places', 'Food'],
    whyThisFits: 'European architectural vibe with Asian budget friendliness. Khinkali dumplings cost ₹40 each, and Tbilisi has free cable car walks and cheap marshrutkas.',
    breakdown: {
      flights: 27000,
      hotels: 11000,
      localTransport: 4500,
      food: 6500,
      activities: 4500,
      emergencyMisc: 4500,
      total: 58000
    },
    transport: {
      type: 'flight',
      name: 'Air Arabia / flydubai / IndiGo (via Sharjah or Dubai)',
      cost: 27000,
      travelTime: 'Approx. 6h 30m total',
      route: 'Starting Location → Tbilisi International (TBS)',
      bookingTip: 'Book connection via Sharjah or Abu Dhabi for the best budget fares.',
      localTransportOptions: [
        { type: 'Tbilisi Metro & Rike Cable Car', approxCost: 600, description: 'Single card for underground subway and mountain cable car' },
        { type: 'Marshrutka (Shared Minibus)', approxCost: 1200, description: 'Authentic cross-country minibus to Kazbegi mountains' },
        { type: 'Bolt App Taxis', approxCost: 1800, description: 'Reliable city rides for under ₹200' }
      ]
    },
    hotels: [
      {
        id: 'ge-h1',
        name: 'Old Tbilisi Carved Balcony Guesthouse',
        category: 'budget',
        pricePerNight: 1600,
        rating: 4.8,
        reviewCount: 290,
        location: 'Sololaki, Old Tbilisi',
        distanceFromAttractions: '400m from Freedom Square',
        facilities: ['Panoramic City Balcony', 'Heating & AC', 'Homemade Wine Welcome', 'Fast WiFi'],
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
        description: 'Classic 19th-century wooden terrace overlooking cobblestone streets and vine pergolas.'
      },
      {
        id: 'ge-h2',
        name: 'Fabrika Loft Design Hotel',
        category: 'comfortable',
        pricePerNight: 3200,
        rating: 4.9,
        reviewCount: 780,
        location: 'Chugureti, Tbilisi',
        distanceFromAttractions: 'Creative courtyard center',
        facilities: ['Artisan Coffee Bar', 'Coworking Yard', 'Air Conditioning', 'Art Gallery'],
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
        description: 'Repurposed Soviet sewing factory turned into the coolest creative hub in the Caucasus.'
      },
      {
        id: 'ge-h3',
        name: 'Rooms Hotel Kazbegi Mountain Lodge',
        category: 'premium',
        pricePerNight: 6500,
        rating: 4.9,
        reviewCount: 910,
        location: 'Stepantsminda (Kazbegi)',
        distanceFromAttractions: 'Direct view of Mount Kazbek & Gergeti Church',
        facilities: ['Heated Glass Pool', 'Forest Sun Deck', 'Lounge Fireplace', 'Fine Georgian Dining'],
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80',
        description: 'Iconic brutalist-wood alpine retreat facing a 5,047m snow-covered volcano.'
      }
    ],
    selectedHotelId: 'ge-h1',
    attractions: [
      {
        id: 'ge-a1',
        name: 'Gergeti Trinity Church in Mount Kazbegi',
        category: 'Mountains',
        description: '14th-century church perched dramatically against the colossal peak of Mount Kazbek.',
        entryFee: 0,
        recommendedTime: '4 hours',
        approxTravelCost: 600,
        distanceFromHotel: 'Day excursion',
        matchReason: 'One of the most photogenic mountain sights on Earth.',
        image: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=600&q=80',
        included: true
      },
      {
        id: 'ge-a2',
        name: 'Abanotubani Sulfur Baths & Narikala Fortress',
        category: 'Historical places',
        description: 'Domed brick thermal bathhouses where Alexander Dumas and Pushkin soaked.',
        entryFee: 700,
        recommendedTime: '2 hours',
        approxTravelCost: 100,
        distanceFromHotel: 'Walking distance',
        matchReason: 'Historic cornerstone of Tbilisi’s founding legend.',
        image: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=600&q=80',
        included: true
      },
      {
        id: 'ge-a3',
        name: 'Tasting Khachapuri & Giant Khinkali',
        category: 'Food',
        description: 'Sample molten Adjarian cheese boat bread with butter and egg yolk.',
        entryFee: 350,
        recommendedTime: '1.5 hours',
        approxTravelCost: 50,
        distanceFromHotel: '300m',
        matchReason: 'World-class comfort food that is deeply satisfying and cheap.',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
        included: true
      }
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Tbilisi & Old Town Exploration',
        theme: 'Cobblestone History',
        travelTip: 'Buy a Metromani card at the airport or metro station for ₹150 for unlimited reloads.',
        activities: [
          { time: '11:00 AM', title: 'Tbilisi TBS Airport Arrival', icon: '✈️', description: 'Scenic landing with Caucasus mountain horizons.', estimatedCost: 350, location: 'TBS' },
          { time: '01:30 PM', title: 'Adjarian Khachapuri Feast', icon: '🧀', description: 'Tear off golden crust and dip into molten Sulguni cheese and butter.', estimatedCost: 280, location: 'Old City' },
          { time: '04:30 PM', title: 'Cable Car to Narikala Fortress', icon: '🚠', description: 'Ride over the Mtkvari river to the ancient citadel.', estimatedCost: 80, location: 'Rike Park' }
        ]
      },
      {
        day: 2,
        title: 'Sulfur Bath Soak & Leghvtakhevi Waterfall',
        theme: 'Thermal Relaxation',
        travelTip: 'Book a private sulfur bath room 1-2 days ahead during peak season.',
        activities: [
          { time: '09:30 AM', title: 'Abanotubani Brick Domes Walk', icon: '♨️', description: 'Discover natural hot waterfall tucked behind bathhouses.', estimatedCost: 0, location: 'Abanotubani' },
          { time: '11:30 AM', title: 'Private Sulfur Thermal Bath & Scrub', icon: '🛁', description: 'Rejuvenating natural hot mineral water soak.', estimatedCost: 800, location: 'Gulo’s Thermal' },
          { time: '03:30 PM', title: 'Dry Bridge Flea Market', icon: '🏺', description: 'Vintage Soviet cameras, antique pocket watches, and art.', estimatedCost: 200, location: 'Dry Bridge' }
        ]
      },
      {
        day: 3,
        title: 'Georgian Military Highway & Kazbegi',
        theme: 'Mountain Grandeur',
        travelTip: 'Stop at Ananuri fortress and Russia-Georgia Friendship monument for photos.',
        activities: [
          { time: '08:00 AM', title: 'Scenic Caucasian Mountain Drive', icon: '🚐', description: 'Cross Jvari pass at 2,379m altitude.', estimatedCost: 900, location: 'Military Highway' },
          { time: '01:00 PM', title: 'Gergeti Trinity Church at 2,170m', icon: '⛪', description: 'High-altitude panorama of Mount Kazbek.', estimatedCost: 400, location: 'Stepantsminda' },
          { time: '05:00 PM', title: 'Hot Mountain Khinkali Soup Dumplings', icon: '🥟', description: 'Hold the stem, take a small bite, sip the rich herbal broth.', estimatedCost: 250, location: 'Kazbegi' }
        ]
      },
      {
        day: 4,
        title: 'Mtskheta Ancient Capital & Jvari Monastery',
        theme: 'Sacred Antiquity',
        travelTip: 'Mtskheta is only 25 minutes from Tbilisi and makes an easy half-day trip.',
        activities: [
          { time: '09:30 AM', title: 'Jvari Monastery Overlook', icon: '🏛️', description: '6th-century cliff monastery where Aragvi and Mtkvari rivers merge.', estimatedCost: 200, location: 'Mtskheta' },
          { time: '01:00 PM', title: 'Svetitskhoveli Cathedral & Churchkhela', icon: '🍇', description: 'Taste walnuts coated in thickened grape juice candy.', estimatedCost: 150, location: 'Old Mtskheta' },
          { time: '06:00 PM', title: 'Fabrika Courtyard Evening Chill', icon: '🎨', description: 'Lively international crowd with craft drinks and vinyl music.', estimatedCost: 350, location: 'Fabrika' }
        ]
      },
      {
        day: 5,
        title: 'Shardeni Street & Departure',
        theme: 'Farewell Sakartvelo',
        travelTip: 'Georgian wine bottles are allowed in checked baggage with protective wrap.',
        activities: [
          { time: '09:30 AM', title: 'Rustaveli Avenue Walk & National Museum', icon: '🏛️', description: 'Stroll past Parliament, Opera House, and tree-lined avenues.', estimatedCost: 300, location: 'Rustaveli' },
          { time: '01:00 PM', title: 'Farewell Shkmeruli Garlic Chicken Lunch', icon: '🍗', description: 'Crispy roasted chicken in rich creamy garlic sauce.', estimatedCost: 400, location: 'Sololaki' },
          { time: '03:30 PM', title: 'Airport Transfer for Return Flight', icon: '🚕', description: 'Smooth Bolt ride to Tbilisi International.', estimatedCost: 400, location: 'TBS' }
        ]
      }
    ],
    cheaperSuggestions: [
      {
        id: 'cs-ge-1',
        category: 'transport',
        title: 'Use shared Marshrutka instead of private driver for Kazbegi',
        description: 'Marshrutka from Didube station costs only ₹350 vs ₹4,000 for private car.',
        potentialSavings: 3650,
        applied: false,
        actionType: 'switch_transit'
      },
      {
        id: 'cs-ge-2',
        category: 'activity',
        title: 'Hike to Gergeti Church instead of hiring 4WD Delica',
        description: 'The scenic 1.5-hour hiking trail is free and builds a great appetite!',
        potentialSavings: 1200,
        applied: false,
        actionType: 'free_activity'
      }
    ],
    visaInfo: 'Liberal visa policy: 1-year visa-free stay for 90+ nationalities, or easy e-visa for Indian and others with valid US/Schengen/UK visas.',
    bestTimeToVisit: 'May to October for warm mountain hiking; December to March for snowy winter fairytale',
    dailyAverageSpend: 3100
  }
];
