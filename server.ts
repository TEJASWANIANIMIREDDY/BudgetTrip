import express from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Server-side Gemini initialization with mandated User-Agent header
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Destination Recommendation endpoint
app.post('/api/recommend-destinations', async (req, res) => {
  try {
    const { budget, adults, children, days, fromCity, fromCountry, travelMonth, preferences, referenceTrip, currency } = req.body;

    const totalTravelers = (Number(adults) || 1) + (Number(children) || 0);
    const budgetNum = Number(budget) || 40000;
    const daysNum = Number(days) || 5;

    if (!ai) {
      return res.json({
        success: true,
        source: 'curated-fallback',
        message: 'Using curated real-budget models (configure GEMINI_API_KEY for dynamic AI generation)',
        destinations: null
      });
    }

    const prompt = `You are the lead travel budgeting AI agent for BudgetTrip AI ("Your Budget. Your Trip. AI Planned.").
A user is planning a budget trip with the following parameters:
- Total Trip Budget: ₹${budgetNum} (All amounts in Indian Rupees INR)
- Total Travelers: ${totalTravelers} (${adults} adults, ${children} children)
- Duration: ${daysNum} days
- Starting Location: ${fromCity || 'India'}, ${fromCountry || 'India'}
- Travel Month: ${travelMonth || 'Flexible'}
- Preferences: ${(preferences || []).join(', ') || 'General exploration'}
- User Reference/Desired Experience: "${referenceTrip || 'Best value for budget'}"

CRITICAL INSTRUCTIONS:
1. Prioritize countries/destinations that REALISTICALLY fit this total budget for ${totalTravelers} people over ${daysNum} days from ${fromCity || 'India'}.
2. Recommend 3 distinct realistic countries/destinations (e.g., Vietnam, Sri Lanka, Nepal, Thailand, Malaysia, Cambodia, Georgia, Uzbekistan, Indonesia/Bali, or affordable domestic if budget is very tight).
3. If the budget is tight (e.g. ₹20,000 - ₹30,000), choose destinations where overland or budget airlines exist (like Nepal, Sri Lanka, or nearby gems).
4. Provide realistic, itemized cost breakdowns (flights, hotels, local transport, food, activities, emergency misc) summing to estimatedTotal.
5. In each destination, provide 3 hotel options (budget ₹1,000-1,500/nt, comfortable ₹1,500-3,000/nt, premium ₹3,000+/nt), 3-4 top attractions matching preferences, a ${daysNum}-day organized itinerary, and 2-3 specific "Make It Cheaper" actionable suggestions with potential savings.
6. Flag budgetFit as:
   - "within" if estimatedTotal <= ${budgetNum}
   - "exact" if estimatedTotal is within 5% of ${budgetNum}
   - "exceeds" if estimatedTotal > ${budgetNum}

Return JSON strictly matching the schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            destinations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  country: { type: Type.STRING },
                  primaryCity: { type: Type.STRING },
                  flagEmoji: { type: Type.STRING },
                  tagline: { type: Type.STRING },
                  heroImage: { type: Type.STRING },
                  estimatedTotal: { type: Type.NUMBER },
                  budgetFit: { type: Type.STRING, enum: ['within', 'exact', 'exceeds'] },
                  recommendedDuration: { type: Type.NUMBER },
                  travelStyles: { type: Type.ARRAY, items: { type: Type.STRING } },
                  whyThisFits: { type: Type.STRING },
                  breakdown: {
                    type: Type.OBJECT,
                    properties: {
                      flights: { type: Type.NUMBER },
                      hotels: { type: Type.NUMBER },
                      localTransport: { type: Type.NUMBER },
                      food: { type: Type.NUMBER },
                      activities: { type: Type.NUMBER },
                      emergencyMisc: { type: Type.NUMBER },
                      total: { type: Type.NUMBER }
                    },
                    required: ['flights', 'hotels', 'localTransport', 'food', 'activities', 'emergencyMisc', 'total']
                  },
                  transport: {
                    type: Type.OBJECT,
                    properties: {
                      type: { type: Type.STRING, enum: ['flight', 'train', 'bus'] },
                      name: { type: Type.STRING },
                      cost: { type: Type.NUMBER },
                      travelTime: { type: Type.STRING },
                      route: { type: Type.STRING },
                      bookingTip: { type: Type.STRING },
                      localTransportOptions: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            type: { type: Type.STRING },
                            approxCost: { type: Type.NUMBER },
                            description: { type: Type.STRING }
                          },
                          required: ['type', 'approxCost', 'description']
                        }
                      }
                    },
                    required: ['type', 'name', 'cost', 'travelTime', 'route', 'bookingTip', 'localTransportOptions']
                  },
                  hotels: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        name: { type: Type.STRING },
                        category: { type: Type.STRING, enum: ['budget', 'comfortable', 'premium'] },
                        pricePerNight: { type: Type.NUMBER },
                        rating: { type: Type.NUMBER },
                        reviewCount: { type: Type.NUMBER },
                        location: { type: Type.STRING },
                        distanceFromAttractions: { type: Type.STRING },
                        facilities: { type: Type.ARRAY, items: { type: Type.STRING } },
                        image: { type: Type.STRING },
                        description: { type: Type.STRING }
                      },
                      required: ['id', 'name', 'category', 'pricePerNight', 'rating', 'reviewCount', 'location', 'distanceFromAttractions', 'facilities', 'image', 'description']
                    }
                  },
                  selectedHotelId: { type: Type.STRING },
                  attractions: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        name: { type: Type.STRING },
                        category: { type: Type.STRING },
                        description: { type: Type.STRING },
                        entryFee: { type: Type.NUMBER },
                        recommendedTime: { type: Type.STRING },
                        approxTravelCost: { type: Type.NUMBER },
                        distanceFromHotel: { type: Type.STRING },
                        matchReason: { type: Type.STRING },
                        image: { type: Type.STRING },
                        included: { type: Type.BOOLEAN }
                      },
                      required: ['id', 'name', 'category', 'description', 'entryFee', 'recommendedTime', 'approxTravelCost', 'distanceFromHotel', 'matchReason', 'image', 'included']
                    }
                  },
                  itinerary: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        day: { type: Type.NUMBER },
                        title: { type: Type.STRING },
                        theme: { type: Type.STRING },
                        travelTip: { type: Type.STRING },
                        activities: {
                          type: Type.ARRAY,
                          items: {
                            type: Type.OBJECT,
                            properties: {
                              time: { type: Type.STRING },
                              title: { type: Type.STRING },
                              icon: { type: Type.STRING },
                              description: { type: Type.STRING },
                              estimatedCost: { type: Type.NUMBER },
                              location: { type: Type.STRING }
                            },
                            required: ['time', 'title', 'icon', 'description', 'estimatedCost', 'location']
                          }
                        }
                      },
                      required: ['day', 'title', 'theme', 'travelTip', 'activities']
                    }
                  },
                  cheaperSuggestions: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        category: { type: Type.STRING, enum: ['hotel', 'transport', 'activity', 'flight', 'dining'] },
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        potentialSavings: { type: Type.NUMBER },
                        applied: { type: Type.BOOLEAN },
                        actionType: { type: Type.STRING, enum: ['switch_hotel', 'switch_transit', 'free_activity', 'off_peak', 'custom'] }
                      },
                      required: ['id', 'category', 'title', 'description', 'potentialSavings', 'applied', 'actionType']
                    }
                  },
                  visaInfo: { type: Type.STRING },
                  bestTimeToVisit: { type: Type.STRING },
                  dailyAverageSpend: { type: Type.NUMBER }
                },
                required: ['id', 'country', 'primaryCity', 'flagEmoji', 'tagline', 'heroImage', 'estimatedTotal', 'budgetFit', 'recommendedDuration', 'travelStyles', 'whyThisFits', 'breakdown', 'transport', 'hotels', 'selectedHotelId', 'attractions', 'itinerary', 'cheaperSuggestions', 'visaInfo', 'bestTimeToVisit', 'dailyAverageSpend']
              }
            }
          },
          required: ['destinations']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    if (parsed.destinations && Array.isArray(parsed.destinations) && parsed.destinations.length > 0) {
      return res.json({
        success: true,
        source: 'gemini-live',
        destinations: parsed.destinations
      });
    }

    return res.json({
      success: true,
      source: 'curated-fallback',
      destinations: null
    });
  } catch (error: any) {
    console.error('Error generating destinations:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Failed to generate recommendations',
      destinations: null
    });
  }
});

// "Make It Cheaper" AI Agent endpoint
app.post('/api/optimize-trip', async (req, res) => {
  try {
    const { destination, budget } = req.body;
    if (!ai) {
      return res.json({
        success: false,
        message: 'Gemini AI not initialized'
      });
    }

    const prompt = `Analyze this trip to ${destination.country} currently estimated at ₹${destination.estimatedTotal} (User Budget: ₹${budget}).
Find 4 fresh, realistic, highly actionable cost-reduction methods to make the trip cheaper without ruining the experience.
Categories: 'hotel', 'transport', 'activity', 'flight', 'dining'.
For each, provide:
- id
- category
- title
- description with exact mechanism
- potentialSavings (in INR number)
- actionType: 'switch_hotel' | 'switch_transit' | 'free_activity' | 'off_peak' | 'custom'

Return JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  category: { type: Type.STRING, enum: ['hotel', 'transport', 'activity', 'flight', 'dining'] },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  potentialSavings: { type: Type.NUMBER },
                  actionType: { type: Type.STRING, enum: ['switch_hotel', 'switch_transit', 'free_activity', 'off_peak', 'custom'] }
                },
                required: ['id', 'category', 'title', 'description', 'potentialSavings', 'actionType']
              }
            }
          },
          required: ['suggestions']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      success: true,
      suggestions: parsed.suggestions || []
    });
  } catch (error: any) {
    console.error('Error optimizing trip:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// AI Chat Assistant endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history, currentDestination, userInput } = req.body;

    if (!ai) {
      return res.json({
        success: true,
        reply: `I can help advise on your budget for ${currentDestination?.country || 'your trip'}. (Note: Add GEMINI_API_KEY to enable full conversational agent powers). Tip: Staying in family guesthouses and eating where locals eat can cut daily spend by up to 35%!`,
        action: null
      });
    }

    const context = `You are the BudgetTrip AI Assistant, an expert budget travel engineer.
Current Trip Context:
- User Budget: ₹${userInput?.budget || 40000}
- Destination: ${currentDestination?.country || 'Undecided'} (${currentDestination?.primaryCity || ''})
- Estimated Trip Cost: ₹${currentDestination?.estimatedTotal || 0}
- Travelers: ${userInput?.adults || 1} adults, ${userInput?.children || 0} children
- Days: ${userInput?.days || 5} days
- Preferences: ${(userInput?.preferences || []).join(', ')}

Guidelines:
- Give concise, realistic, budget-conscious advice.
- When asked "Can I travel here with ₹X?", calculate realistically and give straight answers with actionable cutbacks if tight.
- When asked to make cheaper, find cheaper hotel or replace day, give concrete solutions.
- Format with clean bullet points and clear currency numbers (₹ INR).
- Be polite, encouraging, and highly practical.`;

    const chatContents = [
      { role: 'user', parts: [{ text: `${context}\n\nUser Question: ${message}` }] }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: chatContents,
      config: {
        systemInstruction: "You are the BudgetTrip AI Assistant. Deliver sharp, friendly, mathematically sound budget travel advice."
      }
    });

    return res.json({
      success: true,
      reply: response.text || "I'm here to help you get the most out of every rupee on your trip!",
    });
  } catch (error: any) {
    console.error('Error in chat:', error);
    return res.status(500).json({
      success: false,
      reply: "I'm having a momentary hiccup connecting to the travel agent engine. Let's try again in a second!",
      error: error.message
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`[BudgetTrip AI] Full-stack server running on http://localhost:${PORT} (env: ${isProd ? 'production' : 'development'})`);
  });
}

startServer();
